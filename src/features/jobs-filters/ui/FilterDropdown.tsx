import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { FILTER_INPUT_CLASS, FILTER_LABEL_CLASS } from '@shared/config/jobsFilters';
import { useCloseOnOutsideClick } from '@shared/lib/useCloseOnOutsideClick';

type FilterDropdownProps = {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  formatOption?: (value: string) => string;
};

export const FilterDropdown = ({
  label,
  value,
  options,
  onSelect,
  formatOption = (option) => option,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useCloseOnOutsideClick({
    ref: rootRef,
    isOpen,
    onClose: () => setIsOpen(false),
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative block">
      <span className={FILTER_LABEL_CLASS}>{label}</span>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${FILTER_INPUT_CLASS} flex cursor-pointer items-center justify-between gap-2 pr-2 font-medium`}
        aria-expanded={isOpen}
      >
        <span className="truncate">{formatOption(value)}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-surface/90 text-text-secondary shadow-sm transition-colors">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <div
        className={`absolute left-0 right-0 top-[calc(100%+8px)] z-40 origin-top rounded-xl border border-border/80 bg-surface/95 p-1.5 shadow-xl backdrop-blur transition-all duration-150 ${
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
        }`}
      >
        <div className="max-h-52 overflow-y-auto pr-0.5">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                }`}
              >
                <span>{formatOption(option)}</span>
                {isSelected ? <Check className="h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
