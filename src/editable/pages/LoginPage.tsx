import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { brandLogoDataUrl } from '@/editable/lib/brand-logo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'

export async function generateMetadata(): Promise<Metadata> {
  const metadata = buildPageMetadata({
    path: '/login',
    title: 'Login',
    description: 'Local login page for this public site.',
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

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container,1440px)] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Member access</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-6xl">Welcome back to your account.</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-black/65">This login works locally using browser storage, so testers can create an account and sign in without backend auth.</p>
          </div>
          <div className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8">
            <h2 className="text-2xl font-black tracking-[-0.04em]">Login</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm text-black/60">
              New here? <Link href="/signup" className="font-black text-[#005c6b] underline-offset-4 hover:underline">Create an account</Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
