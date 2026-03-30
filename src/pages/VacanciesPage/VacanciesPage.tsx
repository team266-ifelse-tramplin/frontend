import { JobsMap } from '@features/jobs-map';
import { Header } from '@shared/ui/Header';

export const VacanciesPage = () => {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <JobsMap showMap={false} />
      </main>
    </>
  );
};
