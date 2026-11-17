import React, { useState } from 'react';
import { ChevronDown, PawPrint } from 'lucide-react';
import { FerretSection } from '../data/sections';
import { SectionDriveContent } from '../utils/driveMatcher';
import { HousingHotspotDiagram } from './HousingHotspotDiagram';

interface SectionBlockProps {
  section: FerretSection;
  driveContent?: SectionDriveContent;
}

const SAGE_HIGHLIGHT_PATTERNS = [
  '30–35% protein',
  '15–30% fat',
  'low in fiber',
  'meat-based',
  '43 g/kg of dry food',
  '200–300 calories/kg per day',
  '24 hours a day',
  'short gut transit time',
  'several small meals',
  'heavy bowl',
];

const CAUTION_HIGHLIGHT_PATTERNS = [
  'sweets, dairy products, raisins, fruits, and vegetables',
  'chocolate',
  'upset stomach, diarrhea, and pancreatic problems',
  'hypoglycemia (low blood sugar)',
];

function renderHighlightedAnswerText(text: string): React.ReactNode {
  const allPatterns = [...SAGE_HIGHLIGHT_PATTERNS, ...CAUTION_HIGHLIGHT_PATTERNS];
  const escaped = allPatterns.map((p) =>
    p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    const isCaution = CAUTION_HIGHLIGHT_PATTERNS.some(
      (p) => p.toLowerCase() === lower
    );
    if (isCaution) {
      return (
        <mark
          key={idx}
          className="bg-[#490206] text-[#F3EFE6] font-medium px-1.5 py-0.5 rounded-md"
        >
          {part}
        </mark>
      );
    }

    const isSage = SAGE_HIGHLIGHT_PATTERNS.some(
      (p) => p.toLowerCase() === lower
    );
    if (isSage) {
      return (
        <mark
          key={idx}
          className="bg-[#3A4D2E] text-[#FBF9F5] font-medium px-1.5 py-0.5 rounded-md"
        >
          {part}
        </mark>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  driveContent,
}) => {
  const [openQaIds, setOpenQaIds] = useState<Record<string, boolean>>({});

  const toggleQaItem = (id: string) => {
    setOpenQaIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const hasHotspots =
    Boolean(section.hotspotImageUrl) &&
    Array.isArray(section.hotspots) &&
    section.hotspots.length > 0;
  const hasQaItems =
    Array.isArray(section.qaItems) && section.qaItems.length > 0;
  const hasDriveDocs =
    driveContent && driveContent.documents && driveContent.documents.length > 0;
  const hasDriveImages =
    driveContent && driveContent.images && driveContent.images.length > 0;

  const allQaExpanded =
    hasQaItems &&
    section.qaItems!.every((item) => Boolean(openQaIds[item.id]));

  const handleToggleAllQa = () => {
    if (!section.qaItems) return;
    if (allQaExpanded) {
      setOpenQaIds({});
    } else {
      const next: Record<string, boolean> = {};
      for (const item of section.qaItems) {
        next[item.id] = true;
      }
      setOpenQaIds(next);
    }
  };

  return (
    <section
      id={section.id}
      aria-labelledby={`heading-${section.id}`}
      className="relative scroll-mt-20 py-14 sm:py-20 border-t-2 border-dashed border-[#CEDAC8]"
    >
      {/* Decorative Sage Green Paw Print Divider Badge */}
      <div
        aria-hidden="true"
        className="absolute -top-3.5 left-6 sm:left-10 bg-[#FBF9F5] px-2.5 flex items-center gap-1.5 text-[#7A9170]"
      >
        <PawPrint className="w-3.5 h-3.5 -rotate-12" />
        <PawPrint className="w-3 h-3 rotate-12 opacity-75" />
      </div>

      {/* Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-10 sm:mb-14">
        <div className="lg:col-span-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#FBF9F5] bg-[#4E3524] border border-[#3D291B] rounded-full px-3 py-1 mb-3">
            <PawPrint className="w-3 h-3 text-[#FBF9F5]" aria-hidden="true" />
            <span>Section {section.number}</span>
          </div>
          <h2
            id={`heading-${section.id}`}
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-[#3A4D2E] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {section.title}
          </h2>
        </div>

        <div className="lg:col-span-8">
          {section.subtitle && (
            <p className="text-base sm:text-lg font-medium text-[#3A4D2E]/90 leading-relaxed mb-4 max-w-2xl">
              {section.subtitle}
            </p>
          )}
          {!hasDriveDocs &&
            !hasHotspots &&
            !hasQaItems &&
            section.introPlaceholder && (
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                {section.introPlaceholder}
              </p>
            )}
        </div>
      </div>

      {/* Interactive Hotspot Diagram (e.g., Housing Section) */}
      {hasHotspots ? (
        <div className="space-y-12 sm:space-y-16">
          <HousingHotspotDiagram
            imageUrl={section.hotspotImageUrl!}
            hotspots={section.hotspots!}
          />

          {section.additionalNotes && section.additionalNotes.length > 0 && (
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pt-10 border-t border-dashed border-[#CEDAC8]">
              <div className="lg:col-span-4">
                <p className="text-xs uppercase tracking-widest text-[#5F7356] mb-1.5">
                  {section.number}.2 · Key Reminders
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#3A4D2E] leading-snug">
                  {section.additionalNotesTitle ||
                    'What Else Should You Keep in Mind?'}
                </h3>
              </div>

              <div className="lg:col-span-8 max-w-2xl">
                <ol className="space-y-4">
                  {section.additionalNotes.map((note, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3.5 text-sm sm:text-base text-stone-700 leading-relaxed"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4E3524] text-[#FBF9F5] border border-[#3D291B] text-xs font-semibold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          )}
        </div>
      ) : hasQaItems ? (
        /* Interactive Toggle Point Q&A Layout + Polaroid Scrapbook Photograph (e.g., Nutrition Section) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Polaroid Scrapbook Photo with Sage Washi Tape */}
          {section.featureImageUrl && (
            <div className="lg:col-span-4 flex justify-center pt-3">
              <div className="relative w-2/3 sm:w-72 max-w-[290px] bg-[#FCFBF8] p-3 pb-7 rounded-2xl border border-[#CBD6C3] shadow-md -rotate-2 hover:rotate-0 transition-transform duration-300">
                {/* Sage Green Washi Tape at Top Center */}
                <div
                  aria-hidden="true"
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#CEDAC8]/90 border border-[#B5C5AD]/80 rotate-2 shadow-2xs pointer-events-none"
                />

                <img
                  src={section.featureImageUrl}
                  alt={section.featureImageAlt || `${section.title} illustration`}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover rounded-lg border border-[#E2E8DC] block"
                />

                {/* Subtle Paw Print Stamp on Polaroid Bottom Rim */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-2 right-3.5 flex items-center gap-1 text-[#8CA182]"
                >
                  <PawPrint className="w-3.5 h-3.5 -rotate-12" />
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Toggle Point Q&A List */}
          <div
            className={
              section.featureImageUrl ? 'lg:col-span-8' : 'lg:col-span-12'
            }
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#5F7356]">
                <PawPrint className="w-3.5 h-3.5 text-[#7A9170]" aria-hidden="true" />
                <span>Common Feeding Questions ({section.qaItems!.length})</span>
              </span>
              <button
                type="button"
                onClick={handleToggleAllQa}
                className="text-xs font-medium text-[#4A5D3B] hover:text-[#2F3D26] underline underline-offset-4 cursor-pointer transition-colors"
              >
                {allQaExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            <div className="space-y-3">
              {section.qaItems!.map((item, idx) => {
                const isOpen = Boolean(openQaIds[item.id]);
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-colors ${
                      isOpen
                        ? 'border-[#A9BCA0] bg-[#F3EFE6] shadow-xs'
                        : 'border-[#D8E0D2] bg-[#FAF8F3] hover:border-[#B5C5AD]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleQaItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`answer-${item.id}`}
                      className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4D2E] rounded-xl"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4E3524] text-[#FBF9F5] border border-[#3D291B] text-xs font-semibold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-base sm:text-lg font-serif font-medium text-[#3A4D2E] leading-snug">
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'rotate-180 bg-[#4A5D3B] text-white border-[#4A5D3B]'
                            : 'border-[#C7D3C0] bg-white text-[#4A5D3B]'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`answer-${item.id}`}
                        className="px-4 sm:px-5 pb-4 pt-2.5 pl-14 sm:pl-14 border-t border-dashed border-[#CEDAC8] space-y-2.5 text-sm sm:text-base text-stone-700 leading-relaxed"
                      >
                        {item.answers.length > 1 ? (
                          <ul className="list-disc pl-4 space-y-2 marker:text-[#6E8265]">
                            {item.answers.map((ans, aIdx) => (
                              <li key={aIdx}>{renderHighlightedAnswerText(ans)}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{renderHighlightedAnswerText(item.answers[0])}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : hasDriveDocs || hasDriveImages ? (
        <div className="space-y-12 sm:space-y-16">
          {hasDriveDocs &&
            driveContent!.documents.map((doc, docIndex) => (
              <article
                key={doc.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pt-8 border-t border-stone-200/70"
              >
                <div className="lg:col-span-4">
                  <p className="text-xs text-stone-500 mb-1.5">
                    {section.number}.{docIndex + 1} · Google Drive Document
                  </p>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-stone-900 leading-snug">
                    {doc.name}
                  </h3>
                </div>

                <div className="lg:col-span-8 space-y-4 max-w-2xl">
                  {doc.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm sm:text-base text-stone-700 leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ))}

          {hasDriveImages && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pt-8 border-t border-stone-200/70">
              <div className="lg:col-span-4">
                <p className="text-xs text-stone-500 mb-1.5">
                  {section.number} · Visual References
                </p>
                <h3 className="text-lg sm:text-xl font-serif font-medium text-stone-900 leading-snug">
                  {section.title} Photographs &amp; Figures
                </h3>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {driveContent!.images.map((img, imgIdx) => (
                  <figure key={img.id} className="space-y-2">
                    <div className="w-full overflow-hidden rounded-md border border-stone-200 bg-[#F4F1EA]">
                      <img
                        src={img.objectUrl}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                    <figcaption className="text-xs font-serif italic text-stone-500">
                      Fig. {section.number}.{imgIdx + 1} — {img.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Default Structural Placeholders when no content is loaded yet */
        <>
          <div className="space-y-12 sm:space-y-16">
            {section.subtopics.map((subtopic, index) => (
              <article
                key={subtopic.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pt-8 border-t border-stone-200/70"
              >
                {/* Left Column: Subtopic Index & Heading */}
                <div className="lg:col-span-4">
                  <p className="text-xs text-stone-500 mb-1.5">
                    {section.number}.{index + 1} Subtopic Structure
                  </p>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-stone-900 leading-snug">
                    {subtopic.heading}
                  </h3>
                </div>

                {/* Right Column: Placeholder Text & Future Image Slot */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="max-w-2xl space-y-4">
                    <p className="text-sm sm:text-base font-medium text-stone-800 leading-relaxed">
                      {subtopic.placeholderLead}
                    </p>
                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                      {subtopic.placeholderBody}
                    </p>
                  </div>

                  {/* Reserved Image Frame Placeholder */}
                  <figure className="max-w-2xl">
                    <div
                      role="img"
                      aria-label={subtopic.imagePlaceholderCaption}
                      className="w-full aspect-[16/9] rounded-md border border-dashed border-stone-300 bg-[#F4F1EA] flex flex-col items-center justify-center p-6 text-center"
                    >
                      <span className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                        Image Placeholder ({section.number}.{index + 1})
                      </span>
                      <span className="text-xs sm:text-sm text-stone-600 max-w-md">
                        {subtopic.imagePlaceholderCaption}
                      </span>
                    </div>
                    <figcaption className="text-xs font-serif italic text-stone-500 mt-2">
                      {subtopic.imagePlaceholderCaption}
                    </figcaption>
                  </figure>
                </div>
              </article>
            ))}
          </div>

          {/* Section Summary Placeholder Block */}
          {section.notesPlaceholder && (
            <div className="mt-10 sm:mt-12 pt-6 border-t border-stone-200/70 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="text-xs uppercase tracking-widest text-stone-500">
                  Key Notes Placeholder
                </span>
              </div>
              <div className="lg:col-span-8">
                <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
                  {section.notesPlaceholder}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
