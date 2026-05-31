'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { brandLogoAlt, brandLogoDataUrl } from '@/editable/lib/brand-logo'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 text-[var(--slot4-page-text)] shadow-[0_10px_40px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <div className="h-[3px] bg-[linear-gradient(90deg,#005c6b_0%,#005c6b_35%,#f3cc37_35%,#f3cc37_100%)]" />
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container,1440px)] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black shadow-sm">
            <img src={brandLogoDataUrl} alt={brandLogoAlt} className="h-full w-full object-cover" />
          </span>
          <span className="leading-none">
            <span className="block text-[1.15rem] font-black tracking-[-0.06em]">{SITE_CONFIG.name}</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center xl:flex">
          <Link href="/classified" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-black/80 transition hover:bg-black/[0.03] hover:text-[#005c6b]">
            Classifieds
          </Link>
        </div>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#005c6b] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_32px_rgba(0,92,107,0.22)] transition hover:-translate-y-0.5 hover:bg-[#004956]">
            <UserPlus className="h-4 w-4" />
            Sign up
          </Link>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#f3cc37] px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#edc42a]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-[#005c6b]">
              <UserPlus className="h-3.5 w-3.5" />
            </span>
            Sign in
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:bg-black/[0.03] lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <form action="/search" className="flex items-center gap-2 rounded-[1.4rem] border border-black/10 bg-[#f9f6f1] px-4 py-3">
            <input name="q" type="search" placeholder="Search classifieds" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/40" />
          </form>
          <div className="mt-4 grid gap-2">
            <Link href="/classified" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-[1.1rem] border border-black/8 bg-[#faf8f5] px-4 py-3 text-sm font-semibold text-black/80">
              Classifieds
            </Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link href="/signup" className="rounded-[1.1rem] bg-[#005c6b] px-4 py-3 text-center text-sm font-bold text-white">
              Sign up
            </Link>
            <Link href="/login" className="rounded-[1.1rem] bg-[#f3cc37] px-4 py-3 text-center text-sm font-bold text-black">
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
