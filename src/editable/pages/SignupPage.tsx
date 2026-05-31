import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { brandLogoDataUrl } from '@/editable/lib/brand-logo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  const metadata = buildPageMetadata({
    path: '/signup',
    title: 'Sign up',
    description: 'Local signup page for this public site.',
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

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container,1440px)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div className="rounded-[2.2rem] border border-black/8 bg-[#151110] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/55">Create account</p>
            <h1 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-6xl">Start posting and browsing in one account.</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/74">This sign up screen is presentational and safe for local testing.</p>
          </div>
          <div className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em]">Create account</h2>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-black/60">
              Already have an account? <Link href="/login" className="font-black text-[#005c6b] underline-offset-4 hover:underline">Login</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
