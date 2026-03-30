import { Link } from 'react-router-dom';
import { OpportunityCreateForm } from '@entities/Opportunity';
import { Header } from '@shared/ui/Header';

export const OpportunityCreatePage = () => {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[980px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-text">Создать вакансию</h1>
            <Link to="/my-opportunities" className="text-sm font-semibold text-primary hover:text-primary-hover">
              К моим вакансиям
            </Link>
          </div>

          <OpportunityCreateForm />
        </section>
      </main>
    </>
  );
};
