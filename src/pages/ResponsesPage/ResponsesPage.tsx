import { useMemo, useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@app/providers';
import { Header } from '@shared/ui/Header';
import { getCompanyLabel } from '@shared/lib/opportunityDisplay';
import { useApplicantResponsesData } from '@shared/lib/useApplicantResponsesData';
import { type AuthSession } from '@shared/types/auth';
import { ResponseCard, ResponsesHeaderMetrics, ResponsesStatusTabs, ResponsesToolbar, type ResponsesTabKey } from './ui';

const sortByAppliedAt = (value: string) => {
  const ts = Date.parse(value);
  if (Number.isFinite(ts)) {
    return ts;
  }
  const [dayString = '1'] = value.split(' ');
  const day = Number(dayString);
  return Number.isFinite(day) ? day : 0;
};

export const ResponsesPage = () => {
  const { session } = useAuth();
  const authSession = session as AuthSession | null;
  const { responses, opportunityById, loading, useApi } = useApplicantResponsesData(authSession);
  const [activeTab, setActiveTab] = useState<ResponsesTabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [localMockWithdrawIds, setLocalMockWithdrawIds] = useState<Set<string | number>>(() => new Set());

  const visibleResponses = useMemo(() => {
    if (useApi) {
      return responses;
    }
    return responses.filter((r) => !localMockWithdrawIds.has(r.id));
  }, [responses, useApi, localMockWithdrawIds]);

  const statusCounts = useMemo(
    () => ({
      pending: visibleResponses.filter((response) => response.status === 'pending').length,
      review: visibleResponses.filter((response) => response.status === 'review').length,
      interview: visibleResponses.filter((response) => response.status === 'interview').length,
      offer: visibleResponses.filter((response) => response.status === 'offer').length,
      rejected: visibleResponses.filter((response) => response.status === 'rejected').length,
    }),
    [visibleResponses],
  );

  const filteredResponses = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return visibleResponses
      .filter((response) => {
        if (activeTab === 'in-progress') {
          if (response.status !== 'pending' && response.status !== 'review') {
            return false;
          }
        } else if (activeTab !== 'all' && response.status !== activeTab) {
          return false;
        }

        const opportunity = opportunityById.get(response.opportunityId);
        if (!opportunity) {
          return false;
        }

        if (!search) {
          return true;
        }

        return (
          opportunity.title.toLowerCase().includes(search) ||
          getCompanyLabel(opportunity.company_id).toLowerCase().includes(search)
        );
      })
      .sort((first, second) => {
        const firstDate = sortByAppliedAt(first.appliedAt);
        const secondDate = sortByAppliedAt(second.appliedAt);
        return sortBy === 'newest' ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [visibleResponses, activeTab, searchQuery, sortBy, opportunityById]);

  const withdrawResponse = (responseId: string | number) => {
    setLocalMockWithdrawIds((prev) => new Set(prev).add(responseId));
  };

  const hasResponses = visibleResponses.length > 0;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-4 shadow-sm md:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquareText className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold text-text">Отклики</h1>
            </div>
            <ResponsesHeaderMetrics
              total={visibleResponses.length}
              inReview={statusCounts.pending + statusCounts.review}
              interviews={statusCounts.interview}
            />
          </div>

          {loading ? <p className="mb-3 text-sm text-text-secondary">Загружаем отклики…</p> : null}

          {hasResponses ? (
            <>
              <ResponsesStatusTabs activeTab={activeTab} counts={statusCounts} onTabChange={setActiveTab} />
              <div className="mt-4">
                <ResponsesToolbar
                  searchQuery={searchQuery}
                  sortBy={sortBy}
                  onSearchChange={setSearchQuery}
                  onSortChange={setSortBy}
                />
              </div>

              <div className="mt-4 space-y-3">
                {filteredResponses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center">
                    <p className="text-base font-semibold text-text">В этой выборке откликов пока нет</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Попробуй сменить вкладку, поиск или сортировку.
                    </p>
                  </div>
                ) : (
                  filteredResponses.map((response) => {
                    const opportunity = opportunityById.get(response.opportunityId);
                    if (!opportunity) {
                      return null;
                    }

                    return (
                      <ResponseCard
                        key={response.id}
                        response={response}
                        opportunity={opportunity}
                        onWithdraw={withdrawResponse}
                        withdrawDisabled={useApi}
                      />
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center">
              <p className="text-base font-semibold text-text">У тебя пока нет откликов</p>
              <p className="mt-1 text-sm text-text-secondary">
                Отправь отклик на интересную вакансию, и статусы появятся здесь.
              </p>
              <Link
                to="/opportunities"
                className="mt-4 inline-flex items-center rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                Перейти к вакансиям
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
};
