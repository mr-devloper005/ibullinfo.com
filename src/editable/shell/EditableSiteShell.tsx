import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${dc.shell.page} relative flex min-h-screen flex-col ${className}`}>
      <EditableNavbar />
      <div className="min-h-0 flex-1">{children}</div>
      <EditableFooter />
      <div className="fixed right-0 top-36 z-40 hidden lg:flex flex-col items-end gap-2">
        <div className="overflow-hidden rounded-l-[1.1rem] shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
          <a href="/contact" className="flex h-11 w-11 items-center justify-center bg-[#365899] text-sm font-black text-white">f</a>
          <a href="/contact" className="flex h-11 w-11 items-center justify-center bg-[#1da1f2] text-sm font-black text-white">x</a>
        </div>
        <a href="/contact" className="flex h-28 w-11 items-center justify-center rounded-l-[1.1rem] bg-[#0f6c7a] text-[11px] font-black uppercase tracking-[0.18em] text-white [writing-mode:vertical-rl]">
          Feedback
        </a>
      </div>
    </div>
  )
}
