type ResponsesHeaderMetricsProps = {
  total: number;
  inReview: number;
  interviews: number;
};

export const ResponsesHeaderMetrics = ({ total, inReview, interviews }: ResponsesHeaderMetricsProps) => {
  const metricClassName =
    'rounded-xl border border-border/80 bg-background/60 px-3 py-2 text-center shadow-sm min-w-28';

  return (
    <div className="flex flex-wrap gap-2">
      <div className={metricClassName}>
        <p className="text-xs text-text-secondary">Всего</p>
        <p className="text-lg font-bold text-text">{total}</p>
      </div>
      <div className={metricClassName}>
        <p className="text-xs text-text-secondary">На рассмотрении</p>
        <p className="text-lg font-bold text-primary">{inReview}</p>
      </div>
      <div className={metricClassName}>
        <p className="text-xs text-text-secondary">Интервью</p>
        <p className="text-lg font-bold text-accent">{interviews}</p>
      </div>
    </div>
  );
};
