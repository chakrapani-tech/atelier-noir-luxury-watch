import Watch from "./Watch.jsx";
import { LIST } from "../data.js";

export default function Compare() {
  const rows = Object.keys(LIST[0].spec);
  return (
    <section id="compare" aria-labelledby="cmp-h" className="bg-paper px-6 py-24 text-ink md:px-[4vw] md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <p className="flex items-center gap-4 text-xs tracking-[0.4em] text-brass"><span className="h-px w-10 bg-brass" />COMPARE</p>
          <h2 id="cmp-h" className="mt-4 font-display text-4xl leading-[1.02] md:text-6xl">Find your Noir.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink/10">
          {LIST.map((m) => (
            <article key={m.id} className="reveal md:px-8 first:md:pl-0 last:md:pr-0">
              <div className="grid h-56 place-items-center overflow-hidden bg-mist"><Watch model={m.id} className="h-72 w-auto drop-shadow-[0_18px_22px_rgba(0,0,0,.3)]" label={`${m.name} watch`} /></div>
              <h3 className="mt-5 font-display text-3xl">{m.name}</h3>
              <dl className="mt-4 divide-y divide-ink/10 border-y border-ink/10 text-sm">
                {rows.map((r) => (
                  <div key={r} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3"><dt className="text-ink/50">{r}</dt><dd>{m.spec[r]}</dd></div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <p className="mt-8 text-xs text-ink/50">Illustrative concept specifications for a fictional brand. Not verified technical data.</p>
      </div>
    </section>
  );
}
