/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  FERRET_SECTIONS,
  HERO_CONTENT,
  resolveActiveSectionId,
  calculateReadingProgress,
} from './data/sections';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
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
        {/* Introductory Overview & Pocket Animal Profile Sticker Card */}
        <header className="pt-10 pb-6 sm:pt-16 sm:pb-10">
          <HeroSection content={HERO_CONTENT} />
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-xs text-stone-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          <p className="text-center text-stone-500 pt-2">
            Made by Mengyuan Li &amp; Michaela Plumb 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
