import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Building2, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, Star, UserRound, Bookmark, Camera, Download } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { pagesContent } from '@/editable/content/pages.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { brandLogoDataUrl } from '@/editable/lib/brand-logo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { ArticleListCard, CompactIndexCard, EditorialFeatureCard, HorizontalCard, RailPostCard, getEditablePostImage, getEditableCategory, getEditableExcerpt } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  ({
    ...buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  }),
    icons: {
      icon: brandLogoDataUrl,
      shortcut: brandLogoDataUrl,
      apple: brandLogoDataUrl,
    },
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; promise: string; badge: string }> = {
  article: { icon: FileText, promise: 'A roomy editorial lane for guides, essays, and useful explainers.', badge: 'Read' },
  listing: { icon: Building2, promise: 'Directory cards with quick contact cues, location, and comparison details.', badge: 'Business' },
  classified: { icon: Megaphone, promise: 'Short-form offer cards that stay direct and easy to skim.', badge: 'Offer' },
  image: { icon: Camera, promise: 'Image-first browsing with compact captions and a gallery feel.', badge: 'Gallery' },
  sbm: { icon: Bookmark, promise: 'Saved resources and links that are simple to revisit later.', badge: 'Bookmark' },
  pdf: { icon: Download, promise: 'Documents presented as files with clear download intent.', badge: 'PDF' },
  profile: { icon: UserRound, promise: 'Identity-forward pages for people, brands, and services.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const deck = taskDeck[task]
  const Icon = deck.icon
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const visiblePosts = uniquePosts(posts)
  const featured = visiblePosts[0]
  const supporting = visiblePosts.slice(1, 5)
  const gridPosts = visiblePosts.slice(0, 12)
  const sidebarPosts = visiblePosts.slice(4, 10)
  const archiveVars = { '--archive-bg': '#ffffff', '--archive-text': '#121212', '--archive-surface': '#f9f7f1', '--archive-accent': '#005c6b' } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-white text-[var(--archive-text)]">
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-x-0 top-0 h-px bg-black/5" />
          <div className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-14">
            <div className="rounded-[2.2rem] border border-black/8 bg-[linear-gradient(180deg,#151110_0%,#342720_100%)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/75">
                <Icon className="h-4 w-4" />
                {label}
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-6xl">
                {voice.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">{voice.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {voice.chips.map((chip) => (
                  <span key={chip} className="rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/80">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="inline-flex items-center gap-2 rounded-full bg-[#f3cc37] px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5">
                  Browse all
                </Link>
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                  Search posts
                </Link>
              </div>
            </div>

            <form action={basePath} className="rounded-[2.2rem] border border-black/8 bg-[#faf8f4] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">
                <Filter className="h-4 w-4" />
                Filter results
              </div>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em] text-[var(--archive-text)]">Showing: {categoryLabel}</p>
              <select name="category" defaultValue={category} className="mt-5 h-12 w-full rounded-[1.2rem] border border-black/8 bg-white px-4 text-sm font-semibold outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full rounded-[1.2rem] bg-[#005c6b] text-sm font-black text-white transition hover:bg-[#004956]">
                Apply filter
              </button>
              <div className="mt-5 rounded-[1.2rem] border border-black/8 bg-white p-4 text-sm leading-7 text-black/65">
                {deck.promise}
              </div>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container,1440px)] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-5xl rounded-[1.8rem] border border-black/8 bg-[#f7df58] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="hidden h-20 w-20 items-center justify-center rounded-[1.4rem] border-4 border-black/80 bg-[#fff0a9] text-black lg:flex">
                  <Building2 className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-3xl font-black leading-none tracking-[-0.06em] text-black sm:text-4xl">A better front row for current posts.</p>
                  <p className="mt-2 text-lg leading-7 text-black/80">{pagesContent.home.hero.featureCardDescription}</p>
                </div>
              </div>
              <Link href={basePath} className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
                View the full archive
              </Link>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Latest listing</p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--archive-text)]">Posts arranged to be easy to skim.</h2>
                </div>
                <Link href={basePath} className="hidden text-sm font-bold text-[#005c6b] hover:underline sm:inline-flex">
                  Browse all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {gridPosts.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {gridPosts.map((post, index) => (
                    <ArchiveCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[2rem] border border-dashed border-black/10 bg-[#faf8f4] p-10 text-center">
                  <Search className="mx-auto h-8 w-8 text-black/30" />
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.05em]">No posts found</h3>
                  <p className="mt-2 text-sm leading-7 text-black/60">Try another category or check back once new content is published.</p>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2 text-xl font-black tracking-[-0.04em]">
                  <MapPin className="h-5 w-5 text-[#005c6b]" />
                  Nearby areas
                </div>
                <div className="mt-5 space-y-3">
                  {(sidebarPosts.length ? sidebarPosts : gridPosts).slice(0, 6).map((post, index) => (
                    <Link key={post.id || post.slug || index} href={`${basePath}/${post.slug}`} className="block rounded-[1.2rem] border border-black/6 bg-[#fbf9f4] p-4 transition hover:-translate-y-0.5 hover:bg-white">
                      <p className="text-sm font-black leading-snug text-[var(--archive-text)]">{post.title}</p>
                      <p className="mt-2 text-sm leading-6 text-black/60">{getSummary(post) || getEditableExcerpt(post, 90)}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2 text-xl font-black tracking-[-0.04em]">
                  <Star className="h-5 w-5 text-[#005c6b]" />
                  Rating & reviews
                </div>
                <div className="mt-5 space-y-4">
                  {(featured ? [featured, ...supporting] : gridPosts.slice(0, 4)).slice(0, 4).map((post, index) => (
                    <div key={post.id || post.slug || index} className="rounded-[1.2rem] border border-black/6 bg-[#fbf9f4] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-black leading-snug text-[var(--archive-text)]">{post.title}</p>
                          <div className="mt-2 flex items-center gap-1 text-[#f3b62f]">
                            {Array.from({ length: 5 }).map((_, star) => (
                              <Star key={star} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="rounded-full bg-[#005c6b] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">{index + 1}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-black/60">{getEditableExcerpt(post, 110)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-12 rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-6">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Latest articles</p>
            <div className="mt-5 grid gap-5">
              {(visiblePosts.length ? visiblePosts : posts).slice(0, 3).map((post, index) => (
                <ArchiveArticleCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">Previous</Link> : null}
            <span className="rounded-full bg-[#005c6b] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchiveCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = buildPostUrl(task, post.slug)
  if (index === 0) {
    return (
      <div className="md:col-span-2 xl:col-span-3">
        <EditorialFeatureCard post={post} href={href} label="Featured" />
      </div>
    )
  }
  if (task === 'listing') return <ArticleListCard post={post} href={href} index={index} />
  if (task === 'classified') return <HorizontalCard post={post} href={href} />
  if (task === 'image') return <RailPostCard post={post} href={href} index={index} />
  if (task === 'sbm') return <CompactIndexCard post={post} href={href} index={index} />
  if (task === 'pdf') return <HorizontalCard post={post} href={href} />
  if (task === 'profile') return <RailPostCard post={post} href={href} index={index} />
  return <ArticleListCard post={post} href={href} index={index} />
}

function ArchiveArticleCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = buildPostUrl(task, post.slug)
  return <ArticleListCard post={post} href={href} index={index} />
}

export default function TaskArchiveRoutePlaceholder() {
  return null
}
