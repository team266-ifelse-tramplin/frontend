import { type RefObject } from 'react';
import { Check, MapPin, Search } from 'lucide-react';

type HeaderLocationProps = {
  locationRef: RefObject<HTMLDivElement | null>;
  isLocationOpen: boolean;
  selectedCity: string;
  citySearch: string;
  filteredCities: string[];
  onToggle: () => void;
  onSearchChange: (value: string) => void;
  onSelectCity: (city: string) => void;
};

export const HeaderLocation = ({
  locationRef,
  isLocationOpen,
  selectedCity,
  citySearch,
  filteredCities,
  onToggle,
  onSearchChange,
  onSelectCity,
}: HeaderLocationProps) => {
  return (
    <div ref={locationRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={onToggle}
        className="header-chip header-chip-link group cursor-pointer"
        aria-expanded={isLocationOpen}
        aria-label="Выбор местоположения"
      >
        <MapPin
          className="header-chip-icon text-accent transition-colors group-hover:text-primary"
          strokeWidth={2.2}
        />
        <span>{selectedCity}</span>
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+12px)] z-40 w-80 origin-top rounded-xl border border-border/80 bg-surface p-3 shadow-xl transition-all duration-150 ${
          isLocationOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
        }`}
      >
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            value={citySearch}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск города"
            className="h-10 w-full rounded-xl border border-border/80 bg-background/70 py-2 pl-9 pr-3 text-sm text-text shadow-sm outline-none transition-all placeholder:text-text-secondary/70 hover:border-primary/35 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <p className="mt-4 mb-1 px-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Популярные города
        </p>
        <div className="max-h-64 overflow-y-auto overscroll-contain pr-1">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onSelectCity(city)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  selectedCity === city
                    ? 'bg-primary/10 font-semibold text-primary'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                }`}
              >
                <span>{city}</span>
                {selectedCity === city ? <Check className="h-4 w-4" /> : null}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-text-secondary">Города не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};
