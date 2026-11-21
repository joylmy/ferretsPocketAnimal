import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FERRET_SECTIONS,
  HOUSING_HOTSPOTS,
  getSectionById,
  resolveActiveSectionId,
  calculateReadingProgress,
} from './sections';

test('FERRET_SECTIONS contains exactly the four requested subsections in order', () => {
  assert.equal(FERRET_SECTIONS.length, 4);
  assert.deepEqual(
    FERRET_SECTIONS.map((s) => s.id),
    ['housing', 'nutrition', 'handling', 'veterinary-issues']
  );
  assert.deepEqual(
    FERRET_SECTIONS.map((s) => s.navLabel),
    ['Housing', 'Nutrition', 'Handling', 'Significant Veterinary Issues']
  );
});

test('Housing section uses cagePic.webp hotspot diagram and removes all placeholder text', () => {
  const housing = getSectionById('housing');
  assert.ok(housing);
  assert.equal(housing.introPlaceholder, '');
  assert.equal(housing.notesPlaceholder, '');
  assert.equal(housing.subtopics.length, 0);
  assert.equal(housing.hotspotImageUrl, '/Housing/picture/cagePic.webp');
  assert.equal(housing.hotspots?.length, 10);
  assert.equal(
    housing.additionalNotesTitle,
    'What Else Should You Keep in Mind?'
  );
  assert.equal(housing.additionalNotes?.length, 6);

  for (const spot of HOUSING_HOTSPOTS) {
    assert.ok(spot.x >= 0 && spot.x <= 100);
    assert.ok(spot.y >= 0 && spot.y <= 100);
    assert.ok(spot.point.length > 0);
    assert.ok(spot.text.length > 0);
  }
});

test('Nutrition section includes 6 Q&A toggle items and feature image with placeholders removed', () => {
  const nutrition = getSectionById('nutrition');
  assert.ok(nutrition);
  assert.equal(nutrition.introPlaceholder, '');
  assert.equal(nutrition.notesPlaceholder, '');
  assert.equal(nutrition.subtopics.length, 0);
  assert.equal(nutrition.qaItems?.length, 6);
  assert.equal(
    nutrition.featureImageUrl,
    'https://storage.googleapis.com/decennium-global.appspot.com/knowledge_assets/care_guides/myths-about-ferrets-raw-diet-safety-checklist/hero-g-1784413440446.png'
  );
});

test('Handling section includes Step One, Step Two with image, scruff warning, and 6 bold-phrase cards', () => {
  const handling = getSectionById('handling');
  assert.ok(handling);
  assert.equal(handling.introPlaceholder, '');
  assert.equal(handling.notesPlaceholder, '');
  assert.equal(handling.subtopics.length, 0);
  assert.ok(handling.handlingContent);
  assert.equal(handling.handlingContent.steps.length, 2);
  assert.equal(
    handling.handlingContent.steps[1].imageUrl,
    '/Handling/picture/step2-handling.png'
  );
  assert.deepEqual(
    handling.handlingContent.topicCards.map((c) => c.heading),
    [
      'How socialization impacts ferrets',
      'Trust handling',
      'Environmental factors',
      'High-value food rewards',
      'Blanket handling',
    ]
  );
});

test('Significant Veterinary Issues section includes 2 overview bullets and 7 original-text diseases', () => {
  const vet = getSectionById('veterinary-issues');
  assert.ok(vet);
  assert.equal(vet.introPlaceholder, '');
  assert.equal(vet.notesPlaceholder, '');
  assert.equal(vet.subtopics.length, 0);
  assert.ok(vet.veterinaryContent);
  assert.equal(vet.veterinaryContent.overviewBullets.length, 2);
  assert.deepEqual(
    vet.veterinaryContent.diseases.map((d) => d.heading),
    [
      'Foreign object ingestion',
      'Congestive heart failure',
      'Cancer',
      'Aleutian disease',
      'Epizootic catarrhal enteritis',
      'Adrenal-associated endocrinopathy',
      'Proliferative colitis',
    ]
  );
});

test('getSectionById resolves sections with or without hash prefix', () => {
  const housing = getSectionById('#housing');
  assert.ok(housing);
  assert.equal(housing.title, 'Housing');

  const vet = getSectionById('veterinary-issues');
  assert.ok(vet);
  assert.equal(vet.title, 'Significant Veterinary Issues');

  assert.equal(getSectionById('unknown-section'), undefined);
});

test('resolveActiveSectionId returns the active section based on scroll position', () => {
  const offsets = [
    { id: 'housing', top: 300 },
    { id: 'nutrition', top: 1100 },
    { id: 'handling', top: 1900 },
    { id: 'veterinary-issues', top: 2700 },
  ];

  assert.equal(resolveActiveSectionId(0, offsets, 160), 'housing');
  assert.equal(resolveActiveSectionId(950, offsets, 160), 'nutrition');
  assert.equal(resolveActiveSectionId(1800, offsets, 160), 'handling');
  assert.equal(resolveActiveSectionId(2600, offsets, 160), 'veterinary-issues');
});

test('calculateReadingProgress computes clamped percentage from scroll position', () => {
  assert.equal(calculateReadingProgress(0, 2900, 900), 0);
  assert.equal(calculateReadingProgress(1000, 2900, 900), 50);
  assert.equal(calculateReadingProgress(2000, 2900, 900), 100);
  assert.equal(calculateReadingProgress(2500, 2900, 900), 100);
  assert.equal(calculateReadingProgress(0, 900, 900), 0);
});
