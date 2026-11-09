import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_DRIVE_FOLDER_ID,
  extractDriveFolderId,
  sanitizeSegment,
  parseEmbeddedFolderHtml,
  resolvePublicDownloadTarget,
  computeSyncPlan,
} from './driveSync';

test('extractDriveFolderId parses full Google Drive folder URLs and raw IDs', () => {
  assert.equal(
    extractDriveFolderId(
      'https://drive.google.com/drive/folders/1oQazXR7Y74bQDv8qS0xaByWQzmElnRbz?usp=sharing'
    ),
    '1oQazXR7Y74bQDv8qS0xaByWQzmElnRbz'
  );
  assert.equal(
    extractDriveFolderId('1oQazXR7Y74bQDv8qS0xaByWQzmElnRbz'),
    '1oQazXR7Y74bQDv8qS0xaByWQzmElnRbz'
  );
  assert.equal(extractDriveFolderId('   '), DEFAULT_DRIVE_FOLDER_ID);
});

test('sanitizeSegment removes unsafe path characters and trims whitespace', () => {
  assert.equal(sanitizeSegment('ferret:housing/photo?.jpg'), 'ferret_housing_photo_.jpg');
  assert.equal(sanitizeSegment('text '), 'text');
  assert.equal(sanitizeSegment('..'), '_');
});

test('parseEmbeddedFolderHtml extracts folders, Google Docs, and binary files', () => {
  const sampleHtml = `
    <div class="flip-entries">
      <div class="flip-entry" id="entry-folder123" tabindex="0" role="link">
        <div class="flip-entry-info">
          <a href="https://drive.google.com/drive/folders/folder123" target="_blank">
            <div aria-label="Folder" class="icon-color-1"></div>
            <div class="flip-entry-title">Housing</div>
          </a>
        </div>
        <div class="flip-entry-last-modified"><div>5:12 pm</div></div>
      </div>
      <div class="flip-entry" id="entry-doc456" tabindex="0" role="link">
        <div class="flip-entry-info">
          <a href="https://docs.google.com/document/d/doc456/edit?usp=drive_web" target="_blank">
            <div class="flip-entry-title">Housing Intro</div>
          </a>
        </div>
        <div class="flip-entry-last-modified"><div>5:20 pm</div></div>
      </div>
      <div class="flip-entry" id="entry-img789" tabindex="0" role="link">
        <div class="flip-entry-info">
          <a href="https://drive.google.com/file/d/img789/view?usp=drive_web" target="_blank">
            <div class="flip-entry-title">cage-setup.jpg</div>
          </a>
        </div>
        <div class="flip-entry-last-modified"><div>5:25 pm</div></div>
      </div>
    </div>
  `;

  const parsed = parseEmbeddedFolderHtml(sampleHtml);
  assert.equal(parsed.length, 3);
  assert.deepEqual(parsed[0], {
    id: 'folder123',
    name: 'Housing',
    kind: 'folder',
    lastModifiedText: '5:12 pm',
  });
  assert.deepEqual(parsed[1], {
    id: 'doc456',
    name: 'Housing Intro',
    kind: 'document',
    lastModifiedText: '5:20 pm',
  });
  assert.deepEqual(parsed[2], {
    id: 'img789',
    name: 'cage-setup.jpg',
    kind: 'file',
    lastModifiedText: '5:25 pm',
  });
});

test('resolvePublicDownloadTarget builds direct download and export URLs', () => {
  const docTarget = resolvePublicDownloadTarget({
    id: 'doc456',
    name: 'Housing Intro',
    kind: 'document',
  });
  assert.equal(docTarget.finalFileName, 'Housing Intro.txt');
  assert.ok(docTarget.downloadUrl.includes('/document/d/doc456/export?format=txt'));

  const fileTarget = resolvePublicDownloadTarget({
    id: 'img789',
    name: 'cage-setup.jpg',
    kind: 'file',
  });
  assert.equal(fileTarget.finalFileName, 'cage-setup.jpg');
  assert.ok(fileTarget.downloadUrl.includes('id=img789'));
});

test('computeSyncPlan identifies added, updated, unchanged, and removed files', () => {
  const manifest = {
    'Housing/picture/cage.jpg': {
      id: 'f1',
      relativePath: 'Housing/picture/cage.jpg',
      modifiedTime: '5:12 pm',
    },
    'Housing/text/old.txt': {
      id: 'f2',
      relativePath: 'Housing/text/old.txt',
      modifiedTime: '5:10 pm',
    },
  };

  const remoteFiles = [
    {
      id: 'f1',
      name: 'cage.jpg',
      kind: 'file' as const,
      modifiedTime: '5:12 pm',
      relativePath: 'Housing/picture/cage.jpg',
    },
    {
      id: 'f3',
      name: 'diet.png',
      kind: 'file' as const,
      modifiedTime: '5:30 pm',
      relativePath: 'Nutrition/picture/diet.png',
    },
  ];

  const plan = computeSyncPlan(remoteFiles, manifest);
  assert.equal(plan.unchanged.length, 1);
  assert.equal(plan.toDownload.length, 1);
  assert.equal(plan.toDownload[0].item.relativePath, 'Nutrition/picture/diet.png');
  assert.equal(plan.toRemove.length, 1);
  assert.equal(plan.toRemove[0].relativePath, 'Housing/text/old.txt');
});
