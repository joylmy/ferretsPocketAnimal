import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FerretSection } from '../data/sections';
import { SectionDriveContent } from '../utils/driveMatcher';
import { HousingHotspotDiagram } from './HousingHotspotDiagram';

interface SectionBlockProps {
  section: FerretSection;
  driveContent?: SectionDriveContent;
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
      className="scroll-mt-20 py-14 sm:py-20 border-t border-stone-200"
    >
      {/* Section Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-10 sm:mb-14">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-2">
            <span>Section {section.number}</span>
            <span aria-hidden="true">·</span>
            <span>#{section.id}</span>
          </div>
          <h2
            id={`heading-${section.id}`}
            className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-stone-900 tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {section.title}
          </h2>
        </div>

        <div className="lg:col-span-8">
          {section.subtitle && (
            <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed mb-4 max-w-2xl">
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
            <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start pt-10 border-t border-stone-200/80">
              <div className="lg:col-span-4">
                <p className="text-xs uppercase tracking-widest text-stone-500 mb-1.5">
                  {section.number}.2 · Key Reminders
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 leading-snug">
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
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-200/80 text-stone-800 text-xs font-semibold shrink-0 mt-0.5">
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
        /* Interactive Toggle Point Q&A Layout + Standalone Photograph (e.g., Nutrition Section) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Standalone Image */}
          {section.featureImageUrl && (
            <div className="lg:col-span-4 flex justify-center">
              <img
                src={section.featureImageUrl}
                alt={section.featureImageAlt || `${section.title} illustration`}
                referrerPolicy="no-referrer"
                className="w-2/3 sm:w-72 max-w-[290px] aspect-[4/3] object-cover rounded-xl border border-stone-200/80 shadow-xs block"
              />
            </div>
          )}

          {/* Right Column: Toggle Point Q&A List */}
          <div
            className={
              section.featureImageUrl ? 'lg:col-span-8' : 'lg:col-span-12'
            }
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs uppercase tracking-widest text-stone-500">
                Common Feeding Questions ({section.qaItems!.length})
              </span>
              <button
                type="button"
                onClick={handleToggleAllQa}
                className="text-xs font-medium text-stone-600 hover:text-stone-900 underline underline-offset-4 cursor-pointer transition-colors"
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
                        ? 'border-stone-400/90 bg-[#F3EFE6]/90 shadow-xs'
                        : 'border-stone-200/90 bg-[#FAF8F3] hover:border-stone-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleQaItem(item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`answer-${item.id}`}
                      className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 rounded-xl"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-200/90 text-stone-800 text-xs font-semibold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-base sm:text-lg font-serif font-medium text-stone-900 leading-snug">
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border border-stone-300/80 bg-white text-stone-700 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 bg-stone-900 text-white border-stone-900' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`answer-${item.id}`}
                        className="px-4 sm:px-5 pb-4 pt-1 pl-14 sm:pl-14 border-t border-stone-200/70 space-y-2.5 text-sm sm:text-base text-stone-700 leading-relaxed"
                      >
                        {item.answers.length > 1 ? (
                          <ul className="list-disc pl-4 space-y-2">
                            {item.answers.map((ans, aIdx) => (
                              <li key={aIdx}>{ans}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{item.answers[0]}</p>
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
