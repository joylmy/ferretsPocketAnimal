import React from 'react';
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
  const hasHotspots =
    Boolean(section.hotspotImageUrl) &&
    Array.isArray(section.hotspots) &&
    section.hotspots.length > 0;
  const hasDriveDocs =
    driveContent && driveContent.documents && driveContent.documents.length > 0;
  const hasDriveImages =
    driveContent && driveContent.images && driveContent.images.length > 0;

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
          <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed mb-4 max-w-2xl">
            {section.subtitle}
          </p>
          {!hasDriveDocs && !hasHotspots && section.introPlaceholder && (
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
