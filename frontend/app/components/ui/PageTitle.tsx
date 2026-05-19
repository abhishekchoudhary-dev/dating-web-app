'use client'
import { usePathname } from 'next/navigation'
import { pageTitles } from '@/app/lib/page-titles'

export default function PageTitle() {
    const pathname = usePathname()
    const title = pageTitles[pathname]

    if (!title) return null
    return <h1 className="text-5xl font-bold">{title}</h1>
}