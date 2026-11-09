/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FERRET_SECTIONS,
  resolveActiveSectionId,
  calculateReadingProgress,
} from './data/sections';
import { Navbar } from './components/Navbar';
import { SectionBlock } from './components/SectionBlock';
import { ReadingProgressBar } from './components/ReadingProgressBar';

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    FERRET_SECTIONS[0].id
  );
  const [readingProgress, setReadingProgress] = useState<number>(0);

  const updateScrollMetrics = useCallback(() => {
    const offsets = FERRET_SECTIONS.map((section) => {
      const el = document.getElementById(section.id);
      return {
        id: section.id,
        top: el ? el.offsetTop : 0,
      };
    });
    const current = resolveActiveSectionId(window.scrollY, offsets, 180);
    setActiveSectionId(current);

    const docEl = document.documentElement;
    const progress = calculateReadingProgress(
      window.scrollY,
      docEl.scrollHeight,
      window.innerHeight
    );
    setReadingProgress(progress);
  }, []);

  // Automatically trigger silent background sync of exotic-ferret into /public whenever the app opens or refreshes
  useEffect(() => {
    fetch('/api/drive/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      // Silent background sync
    });
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace(/^#/, '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSectionId(id);
        }, 50);
      }
    }
    updateScrollMetrics();
    window.addEventListener('scroll', updateScrollMetrics, { passive: true });
    window.addEventListener('resize', updateScrollMetrics);
    return () => {
      window.removeEventListener('scroll', updateScrollMetrics);
      window.removeEventListener('resize', updateScrollMetrics);
    };
  }, [updateScrollMetrics]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(sectionId);
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900">
      {/* Sticky Responsive Navigation Bar */}
      <Navbar
        sections={FERRET_SECTIONS}
        activeSectionId={activeSectionId}
        onSelectSection={scrollToSection}
      />

      {/* Right-Side Vertical Reading Progress Bar */}
      <ReadingProgressBar progress={readingProgress} />

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto pl-4 pr-6 sm:px-6 lg:px-8">
        {/* Introductory Overview & Table of Contents Structure */}
        <header className="py-10 sm:py-16">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-widest text-stone-500 mb-4">
            <span>Mustela putorius furo</span>
            <span aria-hidden="true">·</span>
            <span>Single-Page Care &amp; Husbandry Framework</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
            <div className="lg:col-span-7">
              <h1
                className="text-3xl sm:text-5xl font-serif font-medium text-stone-900 tracking-tight mb-5"
                style={{ textWrap: 'balance' }}
              >
                Domestic Ferret Care &amp; Veterinary Reference
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                [Placeholder — General Introduction] This single-page layout provides
                the structural foundation for introducing domestic ferrets across four
                core topics: Housing, Nutrition, Handling, and Significant Veterinary
                Issues. Use the navigation bar above or the section index below to jump
                smoothly to any topic.
              </p>
            </div>

            {/* Hero Primary Image Placeholder */}
            <figure className="lg:col-span-5 w-full">
              <div
                role="img"
                aria-label="Hero Overview Image Placeholder — Reserved for primary ferret portrait or habitat banner"
                className="w-full aspect-[16/10] rounded-md border border-dashed border-stone-300 bg-[#F4F1EA] flex flex-col items-center justify-center p-6 text-center"
              >
                <span className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                  Hero Image Placeholder
                </span>
                <span className="text-xs sm:text-sm text-stone-600 max-w-xs">
                  Reserved for your primary ferret introductory photograph.
                </span>
              </div>
            </figure>
          </div>

          {/* Directory of the 4 Core Subsections */}
          <nav
            aria-label="Table of contents"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-stone-200"
          >
            {FERRET_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(section.id);
                }}
                className="group block py-3 border-b border-stone-200 sm:border-b-0 hover:border-stone-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
              >
                <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">
                  {section.number} · Section
                </div>
                <div className="text-base font-serif font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
                  {section.title}
                </div>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {section.subtitle}
                </p>
              </a>
            ))}
          </nav>
        </header>

        {/* Four Core Content Subsections */}
        <div>
          {FERRET_SECTIONS.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
        </div>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-stone-200 mt-12 py-10 bg-[#F7F4EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-600">
          <nav
            aria-label="Footer section navigation"
            className="flex flex-wrap items-center gap-2"
          >
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-semibold text-stone-900 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
            >
              Ferret Guide
            </a>
            {FERRET_SECTIONS.map((section) => (
              <React.Fragment key={section.id}>
                <span aria-hidden="true">·</span>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section.id);
                  }}
                  className="hover:text-stone-950 hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
                >
                  {section.navLabel}
                </a>
              </React.Fragment>
            ))}
          </nav>

          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-medium text-stone-800 hover:text-stone-950 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
