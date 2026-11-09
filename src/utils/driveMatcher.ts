export type SectionId =
  | 'housing'
  | 'nutrition'
  | 'handling'
  | 'veterinary-issues';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  parentFolderName?: string;
}

export interface SectionDriveContent {
  documents: Array<{
    id: string;
    name: string;
    paragraphs: string[];
  }>;
  images: Array<{
    id: string;
    name: string;
    objectUrl: string;
  }>;
}

/**
 * Extracts a Google Drive Folder ID from a full URL or raw ID string.
 */
export function extractDriveFolderId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Match /folders/{id}
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // Match ?id={id} or &id={id}
  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch && queryMatch[1]) {
    return queryMatch[1];
  }

  // Raw ID (alphanumeric, dashes, underscores, length >= 10)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Maps a file name or subfolder name to one of the 4 ferret sections.
 */
export function inferSectionIdFromName(name: string): SectionId | null {
  const lower = name.toLowerCase();

  if (
    lower.includes('housing') ||
    lower.includes('habitat') ||
    lower.includes('cage') ||
    lower.includes('enclosure') ||
    lower.includes('bedding') ||
    lower.includes('住') ||
    lower.includes('笼') ||
    lower.includes('环境')
  ) {
    return 'housing';
  }

  if (
    lower.includes('nutrition') ||
    lower.includes('nutirtion') ||
    lower.includes('diet') ||
    lower.includes('food') ||
    lower.includes('feeding') ||
    lower.includes('kibble') ||
    lower.includes('营养') ||
    lower.includes('饮食') ||
    lower.includes('喂') ||
    lower.includes('食')
  ) {
    return 'nutrition';
  }

  if (
    lower.includes('handling') ||
    lower.includes('restraint') ||
    lower.includes('scruff') ||
    lower.includes('behavior') ||
    lower.includes('social') ||
    lower.includes('groom') ||
    lower.includes('training') ||
    lower.includes('抱') ||
    lower.includes('抓') ||
    lower.includes('互动') ||
    lower.includes('护理') ||
    lower.includes('行为')
  ) {
    return 'handling';
  }

  if (
    lower.includes('vet') ||
    lower.includes('veterinary') ||
    lower.includes('vetneray') ||
    lower.includes('disease') ||
    lower.includes('medical') ||
    lower.includes('health') ||
    lower.includes('clinical') ||
    lower.includes('illness') ||
    lower.includes('adrenal') ||
    lower.includes('insulinoma') ||
    lower.includes('distemper') ||
    lower.includes('医') ||
    lower.includes('病') ||
    lower.includes('健康')
  ) {
    return 'veterinary-issues';
  }

  return null;
}

/**
 * Splits raw document text into clean, readable paragraphs.
 */
export function splitDocumentIntoParagraphs(rawText: string): string[] {
  return rawText
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}|\n/)
    .map((line) => line.replace(/^\uFEFF/, '').trim())
    .filter((line) => line.length > 0);
}

export function isSupportedTextDocument(mimeType: string, name: string): boolean {
  const lowerName = name.toLowerCase();
  return (
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'text/plain' ||
    mimeType === 'text/markdown' ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.md')
  );
}

export function isSupportedImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}
