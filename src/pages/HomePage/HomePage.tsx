import { Header } from '@shared/ui/Header';
import { JobsMap } from '@shared/ui/JobsMap';
import { HomeHero } from '@widgets/HomeHero';

export const HomePage = () => {
  return (
    <>
      <Header />
      <main className="px-5 py-6 md:px-8">
        <HomeHero />
        <JobsMap />
      </main>
    </>
  );
};
