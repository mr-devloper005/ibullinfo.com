import type { Metadata } from 'next'
import { Building2, MapPin, Phone } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { brandLogoDataUrl } from '@/editable/lib/brand-logo'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export async function generateMetadata(): Promise<Metadata> {
  const metadata = buildPageMetadata({
    path: '/contact',
    title: 'Contact',
    description: 'Get in touch through the site contact page.',
  })
  return {
    ...metadata,
    icons: {
      icon: brandLogoDataUrl,
      shortcut: brandLogoDataUrl,
      apple: brandLogoDataUrl,
    },
  }
}

export default function ContactPage() {
  const lanes = [
    { icon: Building2, title: 'Business onboarding', body: 'Share listing details, service updates, or category requests.' },
    { icon: Phone, title: 'Support follow-up', body: 'Ask about account access, publishing, or site navigation.' },
    { icon: MapPin, title: 'Coverage requests', body: 'Suggest a city, neighborhood, or new topic lane.' },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-[#0a1a1a] text-[var(--editable-page-text,#93B1A6)]">
        <section className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5C8374]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{pagesContent.contact.description}</p>
            <div className="mt-8 grid gap-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.25)]">
                  <lane.icon className="h-5 w-5 text-[#5C8374]" />
                  <h2 className="mt-3 text-xl font-black tracking-[-0.04em]">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/60">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/8 bg-[#0a1a1a] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
