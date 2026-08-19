import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2rem] border border-white/8 bg-[#0a1a1a] p-8 text-center shadow-[0_18px_60px_rgba(4,13,18,0.3)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#183D3D] text-[#183D3D]">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#183D3D] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the master panel will appear here automatically.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
