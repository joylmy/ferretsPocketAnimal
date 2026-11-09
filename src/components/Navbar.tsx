import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { FerretSection } from '../data/sections';

interface NavbarProps {
  sections: FerretSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onSelectSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg font-serif font-semibold tracking-tight text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900"
        >
          Ferret Guide
        </a>

        {/* Zone 2: 4 Navigation Links (Desktop) */}
        <nav
          aria-label="Primary section navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600"
        >
          {sections.map((section) => {
            const isActive = activeSectionId === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleNavClick(e, section.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900 ${
                  isActive
                    ? 'border-stone-900 text-stone-950 font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {section.navLabel}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action on Desktop / Menu Toggle on Mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#housing"
            onClick={(e) => handleNavClick(e, 'housing')}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-stone-50 bg-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            Start Reading
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Mobile section navigation"
          className="md:hidden border-b border-stone-200 bg-[#FBF9F5] px-4 pt-2 pb-4"
        >
          <ul className="flex flex-col divide-y divide-stone-200/70">
            {sections.map((section) => {
              const isActive = activeSectionId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => handleNavClick(e, section.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`flex items-center justify-between py-3 px-2 text-sm transition-colors ${
                      isActive
                        ? 'font-semibold text-stone-950 bg-stone-100/80 rounded-md'
                        : 'font-medium text-stone-700 hover:text-stone-950'
                    }`}
                  >
                    <span>
                      {section.number}. {section.navLabel}
                    </span>
                    {/* <span className="text-xs text-stone-400">Jump to section</span> */}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};
