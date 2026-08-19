import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#0a1a1a] text-[var(--editable-page-text,#93B1A6)]">
        <section className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2.2rem] border border-white/8 bg-[#0a1a1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5C8374]">{pagesContent.about.badge}</p>
              <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-6xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{pagesContent.about.description}</p>
              <div className="mt-8 space-y-4">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-white/65">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5C8374]">0{index + 1}</p>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.05em]">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
