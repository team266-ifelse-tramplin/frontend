import { type ResponseStatus } from '@shared/types/response';

export type ResponsesTabKey = 'all' | 'in-progress' | 'interview' | 'offer' | 'rejected';

export type StatusCounts = Record<ResponseStatus, number>;

type ResponsesStatusTabsProps = {
  activeTab: ResponsesTabKey;
  counts: StatusCounts;
  onTabChange: (tab: ResponsesTabKey) => void;
};

export const ResponsesStatusTabs = ({ activeTab, counts, onTabChange }: ResponsesStatusTabsProps) => {
  const tabs: Array<{ key: ResponsesTabKey; label: string; count: number }> = [
    {
      key: 'all',
      label: 'Все',
      count: counts.pending + counts.review + counts.interview + counts.offer + counts.rejected,
    },
    {
      key: 'in-progress',
      label: 'На рассмотрении',
      count: counts.pending + counts.review,
    },
    {
      key: 'interview',
      label: 'Интервью',
      count: counts.interview,
    },
    {
      key: 'offer',
      label: 'Оффер',
      count: counts.offer,
    },
    {
      key: 'rejected',
      label: 'Отказ',
      count: counts.rejected,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-text-secondary hover:text-text'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`inline-flex min-w-5 items-center justify-center rounded-full px-1 text-xs ${
                isActive ? 'bg-primary/15 text-primary' : 'bg-background/80 text-text-secondary'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
