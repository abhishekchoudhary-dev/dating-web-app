'use client'
import { usePathname } from 'next/navigation'
import { pageTitles } from '@/app/lib/page-titles'

export default function PageTitle() {
    const pathname = usePathname()
    const title = pageTitles[pathname]

    if (!title) return null
    return <h1 className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold flex items-center gap-2">{title}</h1>
}