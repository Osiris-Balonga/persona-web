import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 md:px-10">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <span className="text-lg font-bold tracking-tight">PERSONA</span>
        <a
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
          href="https://github.com/Osiris-Balonga/persona"
        >
          API repository
        </a>
      </header>

      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Public beta
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Fictional people for products and tests.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Persona generates coherent profiles through a simple public API. The
          documentation and live playground are coming together here.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <a href="https://github.com/Osiris-Balonga/persona/blob/dev/docs/developer-api.md">
              Read the API guide
            </a>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-5 text-xs text-muted-foreground">
        Persona · Fictional people. Realistic data.
      </footer>
    </main>
  );
}
