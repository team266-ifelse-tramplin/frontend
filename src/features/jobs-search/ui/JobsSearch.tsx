import { WORK_FORMATS } from '@shared/config/jobsMockData';
import { getWorkFormatLabel } from '@shared/lib/opportunityDisplay';

type JobsSearchProps = {
  searchInputValue: string;
  selectedWorkFormat: string;
  onSearchInputChange: (value: string) => void;
  onSubmit: () => void;
  onQuickFormatToggle: (format: (typeof WORK_FORMATS)[number]) => void;
  containerClassName?: string;
};

export const JobsSearch = ({
  searchInputValue,
  selectedWorkFormat,
  onSearchInputChange,
  onSubmit,
  onQuickFormatToggle,
  containerClassName = 'rounded-xl border border-border bg-background/60 p-3 mb-16',
}: JobsSearchProps) => {
  return (
    <div className={containerClassName}>
      <div className="space-y-2">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <input
            value={searchInputValue}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Должность, компания, навык"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text outline-none"
          />
          <button
            type="submit"
            className="rounded-xl border border-primary bg-primary px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Найти
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {WORK_FORMATS.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => onQuickFormatToggle(format)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedWorkFormat === format
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-text-secondary hover:text-text'
              }`}
            >
              {getWorkFormatLabel(format)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
