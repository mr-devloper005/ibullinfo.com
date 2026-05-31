import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Search, Tag, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { brandLogoDataUrl } from '@/editable/lib/brand-logo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getEditablePostImage, getEditableExcerpt } from '@/editable/cards/PostCards'

export const revalidate = 3
const fallbackImage = '/placeholder.svg?height=900&width=1400'

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  const metadata = post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
  return {
    ...metadata,
    icons: {
      icon: brandLogoDataUrl,
      shortcut: brandLogoDataUrl,
      apple: brandLogoDataUrl,
    },
  }
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = uniquePosts((await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug)).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const formatPlainText = (raw: string) => {
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  return raw.split(/\n{2,}/).map((part) => `<p>${part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

function uniquePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.id || post.slug || post.title, post])).values())
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const detailVars = { '--detail-bg': '#ffffff', '--detail-text': '#121212', '--detail-surface': '#fbf9f4', '--detail-accent': '#005c6b' } as CSSProperties
  const title = getTaskConfig(task)?.label || task

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-white text-[var(--detail-text)]">
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#171112_0%,#2d221d_100%)] text-white">
          <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
            <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <Link href={getTaskConfig(task)?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-black text-white/90 transition hover:bg-white/12">
                  <ArrowLeft className="h-4 w-4" />
                  Back to {title}
                </Link>
                <p className="mt-5 text-[11px] font-black uppercase tracking-[0.24em] text-white/60">{categoryOf(post, title)}</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{post.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">{summaryText(post) || 'A clean detail page for this post.'}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {getField(post, ['website', 'url']) ? <QuickAction href={getField(post, ['website', 'url'])} label="Open website" icon={ExternalLink} /> : null}
                  {getField(post, ['phone', 'telephone', 'mobile']) ? <QuickAction href={`tel:${getField(post, ['phone', 'telephone', 'mobile'])}`} label="Call now" icon={Phone} /> : null}
                  {getField(post, ['email']) ? <QuickAction href={`mailto:${getField(post, ['email'])}`} label="Email" icon={Mail} /> : null}
                </div>
              </div>

              <form action="/search" className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Search this site</p>
                <div className="mt-4 grid gap-3">
                  <label className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white px-4 py-4 text-black">
                    <Search className="h-5 w-5 shrink-0 text-[#005c6b]" />
                    <input name="q" type="search" placeholder="Looking for something similar?" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-black/35" />
                  </label>
                  <label className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white px-4 py-4 text-black">
                    <MapPin className="h-5 w-5 shrink-0 text-black/45" />
                    <input name="location" type="text" placeholder="Location" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-black/35" />
                  </label>
                  <button type="submit" className="inline-flex h-12 items-center justify-center rounded-[1.2rem] bg-[#f3cc37] px-5 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#edc42a]">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <div className="border-b border-black/5 bg-[#faf8f4]">
          <div className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-4 text-sm text-black/60 sm:px-6 lg:px-8">
            <span className="font-medium text-[#005c6b]">Home</span>
            <span className="mx-2">/</span>
            <span>{title}</span>
            <span className="mx-2">/</span>
            <span className="text-black/85">{post.title}</span>
          </div>
        </div>

        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function QuickAction({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/15">
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  const infoItems: Array<[string, string, LucideIcon]> = [
    ['Location', address, MapPin],
    ['Phone', phone, Phone],
    ['Email', email, Mail],
    ['Website', website, Globe2],
  ].filter(([, value]) => Boolean(value)) as Array<[string, string, LucideIcon]>

  return (
    <section className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.6rem] bg-[#f7f5ef] ring-1 ring-black/8">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 text-black/20" />}
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Business listing</p>
              <h2 className="mt-3 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl">{post.title}</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-black/65">{summaryText(post) || 'A listing with clean contact and comparison details.'}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {infoItems.map(([label, value, Icon]) => (
              <div key={label} className="rounded-[1.4rem] border border-black/8 bg-[#fbf9f4] p-4">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/45">
                  <Icon className="h-4 w-4" /> {label}
                </div>
                <p className="mt-2 break-words text-sm font-medium leading-7 text-black/80">{value as string}</p>
              </div>
            ))}
          </div>

          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
          <ContactAction website={website} phone={phone} email={email} />
        </article>

        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <SideInfo title="Quick facts" items={[['Task', getTaskConfig('listing')?.label || 'Listing'], ['Source', SITE_CONFIG.name], ['Category', categoryOf(post, 'Listing')], ['Published', post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently']]} />
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <section className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-14">
      <aside className="rounded-[2.2rem] border border-black/8 bg-[linear-gradient(180deg,#151110_0%,#2f241f_100%)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] lg:sticky lg:top-24 lg:self-start">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Classified notice</p>
        <h2 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em]">{post.title}</h2>
        <div className="mt-7 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white">Email</a> : null}
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white">Website</Link> : null}
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-8 aspect-[4/3] w-full rounded-[1.6rem] object-cover" /> : null}
      </aside>

      <article className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container,1440px)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Image story</p>
          <h2 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em]">{post.title}</h2>
          <p className="mt-5 text-base leading-8 text-black/65">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>

        <div className="grid gap-5 md:grid-cols-2">
          {(images.length ? images : [fallbackImage]).map((image, index) => (
            <figure key={`${image}-${index}`} className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.07)]">
              <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
              {index === 0 ? <figcaption className="p-4 text-sm font-medium text-black/60">Featured visual from this image post.</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10">
        <RelatedPanel task="image" post={post} related={related} />
      </div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-14">
      <article className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Saved resource</p>
        <h2 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl">{post.title}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-black/65">{summaryText(post)}</p>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#005c6b] px-5 py-3 text-sm font-black text-white"><ExternalLink className="h-4 w-4" /> Open saved resource</Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-14">
      <article className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
        <div className="grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.8rem] bg-[#005c6b] text-white shadow-sm">
            <FileText className="h-12 w-12" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">Document resource</p>
            <h2 className="mt-3 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl">{post.title}</h2>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[2rem] border border-black/8 bg-[#fbf9f4]">
            <div className="flex items-center justify-between gap-3 border-b border-black/8 bg-white p-4">
              <span className="text-sm font-black">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#005c6b] px-4 py-2 text-xs font-black text-white">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8 lg:py-14">
      <aside className="rounded-[2.2rem] border border-black/8 bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.07)] lg:sticky lg:top-24 lg:self-start">
        <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#f7f5ef] ring-1 ring-black/8">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-black/20" />}
        </div>
        <h2 className="mt-6 text-4xl font-black leading-[0.96] tracking-[-0.08em]">{post.title}</h2>
        {role ? <p className="mt-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#005c6b]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <section className="mx-auto grid max-w-[var(--editable-container,1440px)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-14">
      <article className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-8 lg:p-10">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">{categoryOf(post, 'Article')}</p>
        <h2 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{post.title}</h2>
        {images[0] ? <img src={images[0]} alt="" className="mt-8 aspect-[16/9] w-full rounded-[1.8rem] object-cover" /> : null}
        <BodyContent post={post} />
        <EditableComments slug={post.slug} comments={comments} />
      </article>
      <RelatedPanel task="article" post={post} related={related} />
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none rounded-[1.6rem] ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-black/78`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] text-white/55">{label}</span><span className="font-black text-white">{value}</span></div>
}

function SideInfo({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <p className="text-lg font-black tracking-[-0.04em]">{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-[1.1rem] border border-black/6 bg-[#fbf9f4] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/40">{label}</p>
            <p className="mt-2 text-sm leading-6 text-black/75">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
   

      {related.length ? (
        <div className="rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black tracking-[-0.04em]">More like this</h3>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#005c6b]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-[1.2rem] border border-black/8 bg-[#fbf9f4] p-3 transition hover:-translate-y-0.5 hover:bg-white">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-[1rem] object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1rem] bg-white"><FileText className="h-6 w-6 text-black/20" /></div>}
      <div className="min-w-0">
        <h4 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h4>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/60">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-black/8 bg-[#fbf9f4] p-5">
      <div className="flex items-center gap-2 text-lg font-black">
        <MessageCircle className="h-5 w-5 text-[#005c6b]" />
        Comments
      </div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[1.2rem] border border-black/6 bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-black/65">{comment.comment}</p>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-black/35">{new Date(comment.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/55">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#005c6b]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-black/8" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4 text-[#005c6b]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-black/40">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#005c6b] px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-black/8 px-4 py-2 text-sm font-black"> <Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-black/8 px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}
