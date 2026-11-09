import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractDriveFolderId,
  inferSectionIdFromName,
  splitDocumentIntoParagraphs,
} from './driveMatcher';

test('extractDriveFolderId parses full URLs, query parameters, and raw IDs', () => {
  assert.equal(
    extractDriveFolderId(
      'https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ?usp=sharing'
    ),
    '1aBcDeFgHiJkLmNoPqRsTuVwXyZ'
  );
  assert.equal(
    extractDriveFolderId(
      'https://drive.google.com/open?id=1987654321_folderId'
    ),
    '1987654321_folderId'
  );
  assert.equal(
    extractDriveFolderId('1aBcDeFgHiJkLmNoPqRsTuVwXyZ'),
    '1aBcDeFgHiJkLmNoPqRsTuVwXyZ'
  );
  assert.equal(extractDriveFolderId('   '), null);
});

test('inferSectionIdFromName maps English and Chinese filenames to the 4 sections', () => {
  assert.equal(inferSectionIdFromName('01_Ferret_Housing_Guide.docx'), 'housing');
  assert.equal(inferSectionIdFromName('Enclosure_Setup.jpg'), 'housing');
  assert.equal(inferSectionIdFromName('Nutrition and Diet.txt'), 'nutrition');
  assert.equal(inferSectionIdFromName('nutirtion_notes'), 'nutrition');
  assert.equal(inferSectionIdFromName('Safe Handling & Restraint'), 'handling');
  assert.equal(
    inferSectionIdFromName('Significant Veterinary Issues - Adrenal'),
    'veterinary-issues'
  );
  assert.equal(inferSectionIdFromName('random_notes.txt'), null);
});

test('splitDocumentIntoParagraphs normalizes line breaks and strips empty lines', () => {
  const input = '\uFEFFFirst paragraph.\r\n\r\nSecond paragraph.\nThird line.';
  assert.deepEqual(splitDocumentIntoParagraphs(input), [
    'First paragraph.',
    'Second paragraph.',
    'Third line.',
  ]);
});
