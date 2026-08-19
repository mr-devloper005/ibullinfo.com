import Link from 'next/link'
import { ArrowRight, Clock3, MapPin, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const images = Array.isArray(content.images) ? content.images : []
  const image = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const imageFields = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => (typeof content[key] === 'string' ? (content[key] as string) : ''))
    .find(Boolean)
  return mediaUrl || image || imageFields || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2.2rem] border border-white/8 bg-[#0a1a1a] shadow-[0_22px_64px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(0,0,0,0.12)]">
      <div className="grid min-h-[420px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[#183D3D]">
          <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.62))]" />
          <span className="absolute left-4 top-4 rounded-full bg-[#040D12]/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#183D3D] shadow-sm">
            {label}
          </span>
        </div>
        <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Featured</p>
            <h3 className="mt-4 text-3xl font-black leading-[0.96] tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-4xl">
              {post.title}
            </h3>
            <p className="mt-5 line-clamp-5 text-sm leading-7 text-white/65">
              {getEditableExcerpt(post, 220)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-white/8 bg-[#183D3D] px-4 py-3">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/55">
              <Sparkles className="h-4 w-4" />
              {getEditableCategory(post)}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#183D3D]">
              Open post <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#0a1a1a] shadow-[0_14px_44px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.13)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#183D3D]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.58))]" />
        <span className="absolute left-3 top-3 rounded-full bg-[#040D12]/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-[#183D3D] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
          {getEditableCategory(post)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{getEditableExcerpt(post, 100)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const meta = getEditableCategory(post)
  return (
    <Link href={href} className="group flex items-start gap-4 rounded-[1.4rem] border border-white/8 bg-[#0a1a1a] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(0,0,0,0.11)]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-[#183D3D] text-sm font-black text-white shadow-sm">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#183D3D]">
          <Clock3 className="h-3.5 w-3.5" />
          {meta}
        </p>
        <h3 className="mt-2 line-clamp-2 text-base font-black leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{getEditableExcerpt(post, 90)}</p>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-4 overflow-hidden rounded-[1.7rem] border border-white/8 bg-[#0a1a1a] p-4 shadow-[0_14px_44px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(0,0,0,0.13)] sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#183D3D]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-1 sm:py-2 sm:pr-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#183D3D] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
            Story {String(index + 1).padStart(2, '0')}
          </span>
          <span className="rounded-full border border-white/8 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            {getEditableCategory(post)}
          </span>
        </div>
        <h2 className="mt-4 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/60">{getEditableExcerpt(post, 170)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#183D3D]">
          Open article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex gap-4 rounded-[1.5rem] border border-white/8 bg-[#0a1a1a] p-4 shadow-[0_14px_44px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_58px_rgba(0,0,0,0.12)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.15rem] bg-[#183D3D]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#183D3D]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{getEditableExcerpt(post, 115)}</p>
      </div>
    </Link>
  )
}

export function ListingBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/8 bg-[#0a1a1a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
      {label}
    </span>
  )
}

export function ListingMeta({ location }: { location?: string }) {
  if (!location) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-[#0a1a1a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
      <MapPin className="h-3.5 w-3.5" />
      {location}
    </span>
  )
}
