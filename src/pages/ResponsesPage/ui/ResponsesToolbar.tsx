import { Search } from 'lucide-react';

type ResponsesToolbarProps = {
  searchQuery: string;
  sortBy: 'newest' | 'oldest';
  onSearchChange: (value: string) => void;
  onSortChange: (value: 'newest' | 'oldest') => void;
};

export const ResponsesToolbar = ({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
}: ResponsesToolbarProps) => {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Поиск по вакансии или компании"
          className="h-10 w-full rounded-xl border border-border/80 bg-background/70 py-2 pl-9 pr-3 text-sm text-text shadow-sm outline-none transition-all placeholder:text-text-secondary/70 hover:border-primary/35 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <select
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value as 'newest' | 'oldest')}
        className="h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm text-text shadow-sm outline-none transition-all hover:border-primary/35 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
      </select>
    </div>
  );
};
