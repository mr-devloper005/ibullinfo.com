import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { brandLogoAlt, brandLogoDataUrl } from '@/editable/lib/brand-logo'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const quickLinks = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Classified', href: '/classified' },
  ] as const

  return (
    <footer className="border-t border-black/5 bg-white text-[var(--slot4-page-text)]">
      <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 border-t border-black/5 pt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black">
              <img src={brandLogoDataUrl} alt={brandLogoAlt} className="h-full w-full object-cover" />
            </span>
            <span className="text-lg font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
          </Link>

          <p className="max-w-xl text-sm leading-7 text-black/65">{globalContent.footer.bottomNote}</p>

          <nav
            className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-black/70"
            aria-label="Footer quick links"
          >
            {quickLinks.map((link, index) => (
              <span key={link.href} className="inline-flex items-center gap-3">
                <Link href={link.href} className="transition hover:text-[#005c6b]">
                  {link.label}
                </Link>
                {index < quickLinks.length - 1 ? <span className="text-black/35">|</span> : null}
              </span>
            ))}
          </nav>

          <p className="text-xs font-medium text-black/45">
            Copyright {year} {SITE_CONFIG.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-black/45">
            <Link href="/login" className="transition hover:text-[#005c6b]">
              Login
            </Link>
            <span>|</span>
            <Link href="/signup" className="transition hover:text-[#005c6b]">
              Sign up
            </Link>
            <span>|</span>
            <Link href="/contact" className="transition hover:text-[#005c6b]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
