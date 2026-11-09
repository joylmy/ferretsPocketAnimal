import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_DRIVE_FOLDER_ID,
  type DriveRemoteItem,
  type SyncManifest,
  computeSyncPlan,
  extractDriveFolderId,
  parseEmbeddedFolderHtml,
  resolvePublicDownloadTarget,
} from './src/utils/driveSync.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, 'public');
const MANIFEST_PATH = path.join(PUBLIC_DIR, '.drive-sync-manifest.json');

interface FullSyncState {
  files: SyncManifest;
  folders: string[];
}

async function ensurePublicDir() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
}

async function readSyncState(): Promise<FullSyncState> {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'files' in parsed) {
      return {
        files: (parsed.files as SyncManifest) || {},
        folders: Array.isArray(parsed.folders) ? parsed.folders : [],
      };
    }
    return { files: parsed as SyncManifest, folders: [] };
  } catch {
    return { files: {}, folders: [] };
  }
}

async function writeSyncState(state: FullSyncState): Promise<void> {
  await ensurePublicDir();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

async function crawlPublicDriveFolderRecursive(
  folderId: string,
  parentPath = ''
): Promise<{ folders: string[]; files: DriveRemoteItem[] }> {
  const url = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(
    folderId
  )}#list`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch Google Drive folder ${folderId} (${res.status})`
    );
  }

  const html = await res.text();
  const entries = parseEmbeddedFolderHtml(html);

  const folders: string[] = [];
  const files: DriveRemoteItem[] = [];

  for (const entry of entries) {
    if (entry.kind === 'folder') {
      const folderRelPath = parentPath
        ? `${parentPath}/${entry.name}`
        : entry.name;
      folders.push(folderRelPath);
      const subResult = await crawlPublicDriveFolderRecursive(
        entry.id,
        folderRelPath
      );
      folders.push(...subResult.folders);
      files.push(...subResult.files);
    } else {
      const target = resolvePublicDownloadTarget(entry);
      const fileRelPath = parentPath
        ? `${parentPath}/${target.finalFileName}`
        : target.finalFileName;
      files.push({
        id: entry.id,
        name: entry.name,
        kind: entry.kind,
        modifiedTime: entry.lastModifiedText || 'unknown',
        relativePath: fileRelPath,
      });
    }
  }

  return { folders, files };
}

async function downloadPublicDriveFile(item: DriveRemoteItem): Promise<void> {
  const { downloadUrl } = resolvePublicDownloadTarget({
    id: item.id,
    name: item.name,
    kind: item.kind,
  });

  const res = await fetch(downloadUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    },
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`Failed to download "${item.name}" (${res.status})`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const targetPath = path.resolve(PUBLIC_DIR, item.relativePath);
  if (!targetPath.startsWith(PUBLIC_DIR)) {
    throw new Error(`Invalid relative path: ${item.relativePath}`);
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, buffer);
}

let activeSyncPromise: Promise<{
  folderId: string;
  syncedAt: string;
  foldersCount: number;
  filesCount: number;
  added: string[];
  updated: string[];
  removed: string[];
}> | null = null;

async function syncDriveFolderToPublic(
  folderId = DEFAULT_DRIVE_FOLDER_ID
) {
  if (activeSyncPromise) {
    return activeSyncPromise;
  }

  activeSyncPromise = (async () => {
    try {
      await ensurePublicDir();
      const { folders: remoteFolders, files: remoteFiles } =
        await crawlPublicDriveFolderRecursive(folderId);
      const prevState = await readSyncState();

      // 1. Determine which folders have subfolders vs leaf folders
      const remoteFolderSet = new Set(remoteFolders);
      const foldersWithSubfolders = new Set<string>();
      const filesByFolder = new Map<string, DriveRemoteItem[]>();

      for (const folderRel of remoteFolders) {
        const parentDir = path.posix.dirname(folderRel);
        if (parentDir && parentDir !== '.') {
          foldersWithSubfolders.add(parentDir);
        }
      }
      for (const fileItem of remoteFiles) {
        const parentDir = path.posix.dirname(fileItem.relativePath);
        if (parentDir && parentDir !== '.') {
          const list = filesByFolder.get(parentDir) || [];
          list.push(fileItem);
          filesByFolder.set(parentDir, list);
        }
      }

      // Ensure all remote folders exist in /public; keep drive-folder.txt in leaf folders that are empty or only contain binary files so IDE File Explorer keeps the directory visible
      for (const folderRel of remoteFolders) {
        const fullFolderPath = path.resolve(PUBLIC_DIR, folderRel);
        if (!fullFolderPath.startsWith(PUBLIC_DIR)) continue;
        await fs.mkdir(fullFolderPath, { recursive: true });
        const keepFile = path.join(fullFolderPath, 'drive-folder.txt');
        const folderFiles = filesByFolder.get(folderRel) || [];
        const hasTextFile = folderFiles.some((f) =>
          /\.(txt|md|json|csv|svg|html|css|ts|js)$/i.test(f.relativePath)
        );

        if (!foldersWithSubfolders.has(folderRel) && !hasTextFile) {
          const content =
            folderFiles.length > 0
              ? `Google Drive folder: Exotics-Ferret Project / ${folderRel.replace(/\//g, ' / ')}\nSynced binary media files on server disk (/public/${folderRel}):\n${folderFiles.map((f) => `- ${path.posix.basename(f.relativePath)} (modified: ${f.modifiedTime})`).join('\n')}\n`
              : `Empty Google Drive folder placeholder: Exotics-Ferret Project / ${folderRel.replace(/\//g, ' / ')}\n(This placeholder will be automatically updated once you add files to this folder in Google Drive.)\n`;
          await fs.writeFile(keepFile, content, 'utf-8');
        } else {
          // Folder has subfolders or visible text files -> remove placeholder if present
          try {
            await fs.unlink(keepFile);
          } catch {
            // Ignore if not present
          }
        }
      }

      // 2. Verify which previously synced files still exist on disk
      const verifiedManifest: SyncManifest = {};
      for (const [relPath, entry] of Object.entries(prevState.files)) {
        const diskPath = path.resolve(PUBLIC_DIR, relPath);
        try {
          await fs.access(diskPath);
          verifiedManifest[relPath] = entry;
        } catch {
          // Missing on disk -> re-download if still in remote
        }
      }

      // 3. Compute file diff and download added/updated files
      const plan = computeSyncPlan(remoteFiles, verifiedManifest);
      const added: string[] = [];
      const updated: string[] = [];
      const removed: string[] = [];

      for (const task of plan.toDownload) {
        await downloadPublicDriveFile(task.item);
        verifiedManifest[task.item.relativePath] = {
          id: task.item.id,
          relativePath: task.item.relativePath,
          modifiedTime: task.item.modifiedTime,
        };
        if (task.reason === 'added') {
          added.push(task.item.relativePath);
        } else {
          updated.push(task.item.relativePath);
        }
      }

      // 4. Remove local files that were deleted in Google Drive
      for (const obsolete of plan.toRemove) {
        const targetPath = path.resolve(PUBLIC_DIR, obsolete.relativePath);
        if (targetPath.startsWith(PUBLIC_DIR)) {
          try {
            await fs.unlink(targetPath);
          } catch {
            // Ignore if already removed
          }
        }
        delete verifiedManifest[obsolete.relativePath];
        removed.push(obsolete.relativePath);
      }

      // 5. Remove local folders that were deleted or renamed in Google Drive (deepest first)
      const removedFolders = prevState.folders
        .filter((f) => !remoteFolderSet.has(f))
        .sort((a, b) => b.length - a.length);

      for (const oldFolder of removedFolders) {
        const fullOldFolder = path.resolve(PUBLIC_DIR, oldFolder);
        if (fullOldFolder.startsWith(PUBLIC_DIR) && fullOldFolder !== PUBLIC_DIR) {
          try {
            await fs.rm(fullOldFolder, { recursive: true, force: true });
          } catch {
            // Ignore
          }
        }
      }

      await writeSyncState({
        files: verifiedManifest,
        folders: remoteFolders,
      });

      return {
        folderId,
        syncedAt: new Date().toISOString(),
        foldersCount: remoteFolders.length,
        filesCount: remoteFiles.length,
        added,
        updated,
        removed,
      };
    } finally {
      activeSyncPromise = null;
    }
  })();

  return activeSyncPromise;
}

async function startServer() {
  await ensurePublicDir();

  // Trigger initial sync immediately on server startup
  syncDriveFolderToPublic().catch((err) => {
    console.error('Initial Google Drive sync warning:', err);
  });

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Silent background sync endpoint triggered automatically when the page opens or refreshes
  app.post('/api/drive/sync', async (req, res) => {
    const rawFolderInput =
      typeof req.body?.folderInput === 'string'
        ? req.body.folderInput
        : DEFAULT_DRIVE_FOLDER_ID;
    const folderId = extractDriveFolderId(rawFolderInput);

    try {
      const result = await syncDriveFolderToPublic(folderId);
      res.json(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to sync Google Drive folder';
      res.status(500).json({ error: message });
    }
  });

  // Ensure requests for synced media files wait for any in-progress initial sync on cold start
  // instead of falling through to Vite's SPA HTML fallback before download completes
  app.use(async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    const decodedPath = decodeURIComponent(req.path);
    const isSyncedAssetRequest =
      /^\/(Housing|Nutrition|Handling|Significant veterinary issues)\//i.test(
        decodedPath
      ) && /\.(webp|png|jpe?g|gif|svg|mp4|webm|mov|txt|pdf)$/i.test(decodedPath);

    if (!isSyncedAssetRequest) {
      return next();
    }

    const candidatePath = path.resolve(
      PUBLIC_DIR,
      decodedPath.replace(/^\/+/, '')
    );
    if (!candidatePath.startsWith(PUBLIC_DIR)) {
      return next();
    }

    try {
      await fs.access(candidatePath);
      return res.sendFile(candidatePath);
    } catch {
      try {
        await syncDriveFolderToPublic();
        await fs.access(candidatePath);
        return res.sendFile(candidatePath);
      } catch {
        return res.status(404).end();
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(PUBLIC_DIR));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
