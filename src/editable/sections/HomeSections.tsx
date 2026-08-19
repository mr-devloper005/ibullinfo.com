'use client'

import { useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
  Star,
  Store,
  Building2,
  Megaphone,
  Image as ImageIcon,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Cpu,
  Dumbbell,
  ForkKnifeCrossed,
  Gamepad2,
  HeartPulse,
  Home,
  Landmark,
  MonitorSmartphone,
  PartyPopper,
  Plane,
  ShoppingBag,
  Stamp,
  Trees,
  WalletCards,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent as _globalContent } from '@/editable/content/global.content'
import { taskPageVoices as _taskPageVoices } from '@/editable/content/task-pages.content'
import { ArticleListCard, CompactIndexCard, HorizontalCard, RailPostCard, getEditableCategory, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const fallbackImage = '/placeholder.svg?height=900&width=1400'

function contentOf(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function safeSummary(post?: SitePost | null, limit = 150) {
  const raw =
    asText(contentOf(post).description) ||
    asText(contentOf(post).summary) ||
    post?.summary ||
    ''
  const clean = raw
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function safeLocation(post?: SitePost | null) {
  return (
    asText(contentOf(post).location) ||
    asText(contentOf(post).address) ||
    asText(contentOf(post).city) ||
    asText(contentOf(post).area) ||
    post?.tags?.[0] ||
    ''
  )
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

function useCarouselMotion() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tick = window.setInterval(() => {
      const maxScroll = node.scrollWidth - node.clientWidth
      if (maxScroll <= 0) return
      const next = node.scrollLeft + Math.max(280, Math.floor(node.clientWidth * 0.74))
      if (next >= maxScroll - 8) {
        node.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        node.scrollBy({ left: Math.max(280, Math.floor(node.clientWidth * 0.74)), behavior: 'smooth' })
      }
    }, 4800)

    return () => window.clearInterval(tick)
  }, [])

  const scrollByDirection = (direction: number) => {
    const node = ref.current
    if (!node) return
    node.scrollBy({ left: direction * Math.max(280, Math.floor(node.clientWidth * 0.74)), behavior: 'smooth' })
  }

  return { ref, scrollByDirection }
}

function heroCards(posts: SitePost[], primaryTask: TaskKey, primaryRoute: string) {
  return uniquePosts(posts).slice(0, 8).map((post, index) => ({
    post,
    href: postHref(primaryTask, post, primaryRoute),
    index,
  }))
}

const categoryIcons = [
  BriefcaseBusiness,
  HeartPulse,
  Cpu,
  Home,
  CarFront,
  Plane,
  BookOpen,
  ShoppingBag,
  Sparkles,
  Stamp,
  Trees,
  ForkKnifeCrossed,
  Dumbbell,
  WalletCards,
  Building2,
  MonitorSmartphone,
  Gamepad2,
  PartyPopper,
  Landmark,
]

function categoryCountFor(posts: SitePost[], categoryName: string, categorySlug: string) {
  const target = normalizeCategory(categorySlug)
  const targetName = categoryName.trim().toLowerCase()

  return uniquePosts(posts).filter((post) => {
    const postContent = contentOf(post)
    const postRecord = post as SitePost & { category?: string }
    const candidateValues = [
      postRecord.category,
      postContent.category,
      postContent.primaryCategory,
      postContent.topic,
      post?.tags?.join(' '),
    ]
      .flatMap((value) => (typeof value === 'string' ? [value] : []))
      .map((value) => value.trim().toLowerCase())

    return candidateValues.some((value) => {
      if (!value) return false
      const normalized = normalizeCategory(value)
      return normalized === target || normalized === targetName || value === targetName || value === categorySlug.toLowerCase()
    })
  }).length
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections: _timeSections }: HomeSectionProps) {
  const categoryItems = useMemo(
    () =>
      CATEGORY_OPTIONS.map((category, index) => {
        const icon = categoryIcons[index % categoryIcons.length]
        return {
          category,
          icon,
          count: categoryCountFor(posts, category.name, category.slug),
        }
      }),
    [posts],
  )
  const { ref: categoryRailRef, scrollByDirection: scrollCategoryRail } = useCarouselMotion()
  const featured = heroCards(posts, primaryTask, primaryRoute)
  const leadPost = featured[0]?.post
  const supportingPosts = featured.slice(1, 4).map(({ post }) => post)

  return (
    <section className="relative overflow-hidden bg-[#0a1a1a]">
      <div className="absolute inset-x-0 top-0 h-px bg-black/5" />
      <div className="slot4-skyline relative overflow-hidden border-b border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.92)_74%,rgba(255,255,255,0.98)_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.95), rgba(255,255,255,0.4) 35%, rgba(255,255,255,0) 70%)' }} />
        <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 pb-7 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="mx-auto grid max-w-[1180px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="slot4-fade-up relative z-10">
             
              <h1 className="mt-5 max-w-[620px] text-balance text-[clamp(2.6rem,7vw,5.7rem)] font-black leading-[0.95] tracking-[-0.07em] text-[#93B1A6]">
                Find what you need, post what you want, and keep moving.
              </h1>
              <p className="mt-5 max-w-[590px] text-[clamp(1rem,1.6vw,1.08rem)] leading-8 text-white/62">
                Browse local listings, publish your own offer, and jump into new opportunities with a layout that keeps the path clear.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full bg-[#183D3D] px-6 py-3.5 text-sm font-black text-white shadow-[0_16px_28px_rgba(0,92,107,0.18)] transition hover:-translate-y-0.5 hover:bg-[#004c58]">
                  Browse {taskLabel(primaryTask)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
             
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Fast discovery', 'Easy publishing', 'All categories in one place'].map((item) => (
                  <span key={item} className="rounded-full border border-white/8 bg-[#0a1a1a] px-4 py-2 text-xs font-medium text-white/64 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="slot4-fade-up relative z-10 lg:justify-self-end">
              <div className="slot4-card relative overflow-hidden rounded-[28px] p-4 sm:p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,92,107,0.06),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.94))]" />
                <div className="relative grid gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-white/45">Spotlight</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#93B1A6]">A clean place to explore, compare, and publish.</h2>
                    </div>
                    <span className="rounded-full bg-[#183D3D] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-white">
                      Live
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                    <article className="overflow-hidden rounded-[24px] bg-[#183D3D] text-white shadow-[0_16px_35px_rgba(0,0,0,0.16)]">
                      <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${getEditablePostImage(leadPost) || fallbackImage})` }} />
                      <div className="p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/50">{getEditableCategory(leadPost) || taskLabel(primaryTask)}</p>
                        <h3 className="mt-2 text-xl font-black leading-tight">{leadPost?.title || 'Featured listing'}</h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/72">{safeSummary(leadPost, 110) || 'A curated highlight with space for details, links, and a quick decision.'}</p>
                      </div>
                    </article>
                    <div className="grid gap-3">
                      {supportingPosts.map((post, index) => (
                        <Link key={post.slug || post.id || post.title || index} href={postHref(primaryTask, post, primaryRoute)} className="group rounded-[22px] border border-white/8 bg-[#0a1a1a]/88 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(0,0,0,0.1)]">
                          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/42">{getEditableCategory(post) || taskLabel(primaryTask)}</p>
                          <h4 className="mt-2 line-clamp-2 text-[15px] font-black leading-snug text-[#93B1A6]">{post.title}</h4>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{safeSummary(post, 84) || 'Compact space for a second look and quick details.'}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 pb-8 pt-2 sm:px-6 lg:px-8">
        <div className="slot4-card rounded-[28px] p-4 sm:p-5 lg:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#183D3D]">Categories</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[#93B1A6] sm:text-3xl">Quick jumps to all categories.</h2>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scrollCategoryRail(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0a1a1a] text-white/70 shadow-sm transition hover:bg-black/[0.03]" aria-label="Previous categories">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => scrollCategoryRail(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0a1a1a] text-white/70 shadow-sm transition hover:bg-black/[0.03]" aria-label="Next categories">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div ref={categoryRailRef} className="slot4-carousel mt-6 flex gap-3 overflow-x-auto pb-2">
            {categoryItems.map(({ category, icon: Icon, count: _count }) => (
              <div
                key={category.slug}
                className="group flex min-w-[150px] shrink-0 flex-col rounded-[22px] border border-white/8 bg-[#0a1a1a] px-4 py-4 text-left shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:border-[#183D3D]/20 hover:shadow-[0_16px_32px_rgba(0,0,0,0.3)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5C8374]/15 text-[#183D3D] transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-4 text-[15px] font-black leading-snug text-white/80">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask: _primaryTask, primaryRoute: _primaryRoute, posts, timeSections }: HomeSectionProps) {
  const taskCards = useMemo(() => {
    const counts = timeSections.map((section) => section.posts.length)
    return SITE_CONFIG.tasks.slice(0, 9).map((task, index) => ({
      task,
      count: counts[index % Math.max(counts.length, 1)] || posts.length,
      icon: [Building2, Megaphone, Sparkles, ImageIcon, Store, Clock3, BadgeCheck, MapPin][index % 8],
    }))
  }, [posts.length, timeSections])

  const { ref, scrollByDirection } = useCarouselMotion()

  return (
    <section className="border-y border-white/5 bg-[#183D3D]">
      <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Categories</p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-3xl">
              Quick jumps to the main sections.
            </h2>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <button type="button" onClick={() => scrollByDirection(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-[#0a1a1a] text-white/70 transition hover:bg-black/[0.03]" aria-label="Scroll categories left">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scrollByDirection(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-[#0a1a1a] text-white/70 transition hover:bg-black/[0.03]" aria-label="Scroll categories right">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={ref} className="slot4-carousel mt-6 flex gap-5 overflow-x-auto pb-2">
          {taskCards.map(({ task, count, icon: Icon }) => (
            <Link
              key={task.key}
              href={task.route}
              className="group flex min-w-[170px] shrink-0 flex-col items-center rounded-[1.8rem] border border-white/8 bg-[#0a1a1a] px-5 py-5 text-center shadow-[0_12px_32px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.1)] sm:min-w-[190px]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[#5C8374]/15 text-[#183D3D]">
                <Icon className="h-7 w-7" />
              </span>
              <span className="mt-4 text-[15px] font-semibold leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">
                {task.label}
              </span>
              <span className="mt-2 text-sm font-bold text-[#183D3D]">({count})</span>
            </Link>
          ))}
          {!taskCards.length ? (
            <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-[#0a1a1a] px-5 py-4 text-sm text-white/55">
              Browse categories will appear here.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const railPosts = heroCards(posts, primaryTask, primaryRoute)
  const { ref, scrollByDirection } = useCarouselMotion()
  if (!railPosts.length) return null

  return (
    <section className="bg-[#0a1a1a]">
      <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Featured Business</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-4xl">
              A rotating rail of featured cards.
            </h2>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <button type="button" onClick={() => scrollByDirection(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-[#183D3D] text-white/70 transition hover:bg-black/[0.03]" aria-label="Previous featured card">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scrollByDirection(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-[#183D3D] text-white/70 transition hover:bg-black/[0.03]" aria-label="Next featured card">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={ref} className="slot4-carousel mt-7 flex gap-4 overflow-x-auto pb-2">
          {railPosts.map(({ post, href, index }) => (
            <div key={post.id || post.slug || index} className="w-[300px] shrink-0 sm:w-[330px] lg:w-[25%] lg:min-w-[300px]">
              <RailPostCard post={post} href={href} index={index} />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.6rem] border border-white/8 bg-[#183D3D] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Why it works</p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              {pagesContent.home.hero.featureCardDescription}
            </p>
          </div>
          {timeSections.slice(0, 3).map((section) => (
            <Link key={section.key} href={section.href} className="rounded-[1.6rem] border border-white/8 bg-[#0a1a1a] p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.3)]">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">{section.eyebrow}</p>
              <h3 className="mt-3 text-xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collectedPosts = uniquePosts(timeSections.flatMap((section) => section.posts))
  const latestPosts = (collectedPosts.length ? collectedPosts : posts).slice(0, 9)
  const listingPosts = latestPosts.slice(0, 6)
  const articlePosts = (posts.length ? posts : latestPosts).slice(0, 3)
  const sidebarEntries = timeSections.length ? timeSections : [
    {
      key: 'fallback-1',
      title: 'Nearby areas',
      eyebrow: 'Local area',
      description: 'Fresh places and practical spots appear here.',
      task: primaryTask,
      posts: latestPosts.slice(0, 4),
      href: primaryRoute,
    },
  ]

  return (
    <section className="bg-[#183D3D]">
      <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-5xl rounded-[1.8rem] border border-white/8 bg-[#5C8374]/15 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-center gap-4">
              <div className="hidden h-20 w-20 items-center justify-center rounded-[1.4rem] border-4 border-white/80 bg-[#5C8374]/15 text-[#93B1A6] lg:flex">
                <Store className="h-10 w-10" />
              </div>
              <div>
                <p className="text-3xl font-black leading-none tracking-[-0.06em] text-[#93B1A6] sm:text-4xl">Post, promote, and browse faster.</p>
                <p className="mt-2 text-lg leading-7 text-white/85">A cleaner lane for local listings, offers, and useful pages.</p>
              </div>
            </div>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
              List your products now
            </Link>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Latest Listing</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)]">Posts arranged for quick scanning.</h2>
              </div>
              <Link href={primaryRoute} className="hidden text-sm font-bold text-[#183D3D] hover:underline sm:inline-flex">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {listingPosts.map((post, index) => {
                const href = postHref(primaryTask, post, primaryRoute)
                if (index === 0) return <ArticleListCard key={post.id || post.slug || index} post={post} href={href} index={index} />
                if (index === 1) return <CompactIndexCard key={post.id || post.slug || index} post={post} href={href} index={index} />
                if (index === 2) return <RailPostCard key={post.id || post.slug || index} post={post} href={href} index={index} />
                if (index === 3) return <HorizontalCard key={post.id || post.slug || index} post={post} href={href} />
                if (index === 4) return <CompactIndexCard key={post.id || post.slug || index} post={post} href={href} index={index} />
                return <RailPostCard key={post.id || post.slug || index} post={post} href={href} index={index} />
              })}
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 text-xl font-black tracking-[-0.04em]">
                <MapPin className="h-5 w-5 text-[#183D3D]" />
                Your Nearby Areas
              </div>
              <div className="mt-5 max-h-[380px] space-y-3 overflow-auto pr-2">
                {sidebarEntries.flatMap((section) => section.posts.slice(0, 2)).map((post, index) => {
                  const location = safeLocation(post) || sidebarEntries[index % sidebarEntries.length]?.title || 'Nearby spot'
                  return (
                    <div key={post.id || post.slug || index} className="rounded-[1.2rem] border border-white/6 bg-[#0a1a1a] p-4">
                      <p className="line-clamp-2 text-sm font-black leading-snug text-[var(--slot4-page-text)]">{post.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/60">{location}</p>
                    </div>
                  )
                })}
                {!sidebarEntries.length ? (
                  <div className="rounded-[1.2rem] border border-dashed border-white/10 bg-[#0a1a1a] p-4 text-sm text-white/55">
                    Nearby places will appear as content grows.
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 text-xl font-black tracking-[-0.04em]">
                <Star className="h-5 w-5 text-[#183D3D]" />
                Rating & Reviews
              </div>
              <div className="mt-5 space-y-4">
                {articlePosts.map((post, index) => (
                  <div key={post.id || post.slug || index} className="rounded-[1.2rem] border border-white/6 bg-[#0a1a1a] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-black leading-snug text-[var(--slot4-page-text)]">{post.title}</p>
                        <div className="mt-2 flex items-center gap-1 text-[#183D3D]">
                          {Array.from({ length: 5 }).map((_, star) => (
                            <Star key={star} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="rounded-full bg-[#183D3D] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                        {index + 1}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">{safeSummary(post, 130)}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)] sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Latest Articles</p>
            <div className="mt-5 grid gap-5">
              {articlePosts.map((post, index) => (
                <ArticleListCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Top Searches</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Rent a room', 'Mobile service', 'Wedding photographer', 'Used furniture', 'Project work', 'Local tutor', 'Office space', 'Marketing help'].map((item) => (
                  <Link key={item} href="/search" className="rounded-full border border-white/8 bg-[#183D3D] px-4 py-2 text-sm font-medium text-white/70 transition hover:-translate-y-0.5 hover:bg-black/[0.03]">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[#183D3D] p-6 text-white shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/65">Keep browsing</p>
              <h3 className="mt-3 text-3xl font-black leading-[0.96] tracking-[-0.06em]">A smoother path to post, promote, and discover.</h3>
              <p className="mt-4 text-sm leading-7 text-white/78">
                The footer wraps everything together with a clean link system and a simple call to action.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-full bg-[#0a1a1a] px-5 py-3 text-sm font-black text-[#93B1A6] transition hover:-translate-y-0.5">
                  Contact us
                </Link>
                <Link href="/signup" className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#0a1a1a]">
      <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[2rem] border border-white/8 bg-[#183D3D] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#183D3D]">Ready to publish?</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-[var(--slot4-page-text)] sm:text-4xl">
                Keep the layout clean, the browsing easy, and the next action obvious.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/60">
                {pagesContent.home.cta.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[#183D3D] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
                {pagesContent.home.cta.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-[#0a1a1a] px-5 py-3 text-sm font-bold text-[#93B1A6] transition hover:-translate-y-0.5 hover:bg-black/[0.03]">
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
