import { Button } from '@shared/ui/Button';

export const HomeHero = () => {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 py-12 text-center">
      <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-text md:text-5xl">
        Найди <span className="text-primary">стажировку</span> или{' '}
        <span className="text-primary">первую работу</span>
      </h1>

      <div className="w-full max-w-3xl rounded-2xl border border-border/80 bg-surface/95 p-3 shadow-sm">
        <form className="flex w-full items-center gap-3" role="search" aria-label="Поиск вакансий">
          <input
            type="search"
            placeholder="Должность, компания или ключевое слово"
            className="h-14 w-full rounded-xl border border-border bg-surface px-5 text-lg text-text placeholder:text-text-secondary/80 focus:border-primary focus:outline-none"
          />
          <Button size="lg" rounded="xl" className="h-14 min-w-36 text-lg">
            Найти
          </Button>
        </form>
      </div>
    </section>
  );
};
