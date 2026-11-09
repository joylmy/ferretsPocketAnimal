export const DEFAULT_DRIVE_FOLDER_ID = '1oQazXR7Y74bQDv8qS0xaByWQzmElnRbz';
export const DEFAULT_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1oQazXR7Y74bQDv8qS0xaByWQzmElnRbz?usp=sharing';

export type DriveEntryKind =
  | 'folder'
  | 'file'
  | 'document'
  | 'spreadsheet'
  | 'presentation';

export interface ParsedDriveEntry {
  id: string;
  name: string;
  kind: DriveEntryKind;
  lastModifiedText: string;
}

export interface DriveRemoteItem {
  id: string;
  name: string;
  kind: Exclude<DriveEntryKind, 'folder'>;
  modifiedTime: string;
  relativePath: string;
}

export interface SyncManifestEntry {
  id: string;
  relativePath: string;
  modifiedTime: string;
}

export type SyncManifest = Record<string, SyncManifestEntry>;

/**
 * Extracts a Google Drive folder ID from a Drive URL or returns the trimmed ID directly.
 */
export function extractDriveFolderId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return DEFAULT_DRIVE_FOLDER_ID;
  }

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  return trimmed;
}

/**
 * Decodes basic HTML entities from Google Drive embedded folder view titles.
 */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\u202f/g, ' ')
    .trim();
}

/**
 * Sanitizes a single filename or folder segment from Google Drive so it can be safely written inside /public.
 */
export function sanitizeSegment(name: string): string {
  return decodeHtmlEntities(name)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/^\.+$/, '_')
    .trim();
}

/**
 * Parses the HTML returned by https://drive.google.com/embeddedfolderview?id=<FOLDER_ID>#list
 * into structured folder and file entries.
 */
export function parseEmbeddedFolderHtml(html: string): ParsedDriveEntry[] {
  const entries: ParsedDriveEntry[] = [];
  const parts = html.split('<div class="flip-entry"');

  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const idMatch = chunk.match(/id="entry-([a-zA-Z0-9_-]+)"/);
    const hrefMatch = chunk.match(/<a\s+href="([^"]+)"/);
    const titleMatch = chunk.match(
      /<div class="flip-entry-title">([\s\S]*?)<\/div>/
    );
    const modifiedMatch = chunk.match(
      /<div class="flip-entry-last-modified">\s*<div>([\s\S]*?)<\/div>\s*<\/div>/
    );

    if (!idMatch || !titleMatch) continue;

    const id = idMatch[1];
    const href = hrefMatch ? hrefMatch[1] : '';
    const rawTitle = titleMatch[1];
    const name = sanitizeSegment(rawTitle);
    const lastModifiedText = modifiedMatch
      ? decodeHtmlEntities(modifiedMatch[1])
      : '';

    if (!name) continue;

    let kind: DriveEntryKind = 'file';
    if (
      href.includes('/drive/folders/') ||
      chunk.includes('aria-label="Folder"')
    ) {
      kind = 'folder';
    } else if (href.includes('docs.google.com/document/')) {
      kind = 'document';
    } else if (href.includes('docs.google.com/spreadsheets/')) {
      kind = 'spreadsheet';
    } else if (href.includes('docs.google.com/presentation/')) {
      kind = 'presentation';
    }

    entries.push({
      id,
      name,
      kind,
      lastModifiedText,
    });
  }

  return entries;
}

/**
 * Resolves final filename and download URL for a non-folder Google Drive item.
 */
export function resolvePublicDownloadTarget(
  entry: Pick<ParsedDriveEntry, 'id' | 'name' | 'kind'>
): { finalFileName: string; downloadUrl: string } {
  if (entry.kind === 'document') {
    const hasExt = /\.(txt|md)$/i.test(entry.name);
    return {
      finalFileName: hasExt ? entry.name : `${entry.name}.txt`,
      downloadUrl: `https://docs.google.com/document/d/${encodeURIComponent(
        entry.id
      )}/export?format=txt`,
    };
  }
  if (entry.kind === 'spreadsheet') {
    const hasExt = /\.csv$/i.test(entry.name);
    return {
      finalFileName: hasExt ? entry.name : `${entry.name}.csv`,
      downloadUrl: `https://docs.google.com/spreadsheets/d/${encodeURIComponent(
        entry.id
      )}/export?format=csv`,
    };
  }
  if (entry.kind === 'presentation') {
    const hasExt = /\.pdf$/i.test(entry.name);
    return {
      finalFileName: hasExt ? entry.name : `${entry.name}.pdf`,
      downloadUrl: `https://docs.google.com/presentation/d/${encodeURIComponent(
        entry.id
      )}/export/pdf`,
    };
  }

  return {
    finalFileName: entry.name,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${encodeURIComponent(
      entry.id
    )}`,
  };
}

/**
 * Computes which remote Drive files need to be downloaded (added/updated),
 * which are unchanged, and which previously synced local files were removed in Drive.
 */
export function computeSyncPlan(
  remoteFiles: DriveRemoteItem[],
  manifest: SyncManifest
): {
  toDownload: Array<{ item: DriveRemoteItem; reason: 'added' | 'updated' }>;
  unchanged: DriveRemoteItem[];
  toRemove: SyncManifestEntry[];
} {
  const toDownload: Array<{ item: DriveRemoteItem; reason: 'added' | 'updated' }> = [];
  const unchanged: DriveRemoteItem[] = [];
  const seenPaths = new Set<string>();

  for (const item of remoteFiles) {
    seenPaths.add(item.relativePath);
    const existing = manifest[item.relativePath];
    if (!existing) {
      toDownload.push({ item, reason: 'added' });
      continue;
    }

    const sameId = existing.id === item.id;
    const sameModified =
      Boolean(existing.modifiedTime) &&
      existing.modifiedTime === item.modifiedTime;

    if (sameId && sameModified) {
      unchanged.push(item);
    } else {
      toDownload.push({ item, reason: 'updated' });
    }
  }

  const toRemove: SyncManifestEntry[] = [];
  for (const [relPath, entry] of Object.entries(manifest)) {
    if (!seenPaths.has(relPath)) {
      toRemove.push(entry);
    }
  }

  return { toDownload, unchanged, toRemove };
}
