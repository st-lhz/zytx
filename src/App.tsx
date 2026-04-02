import { useEffect, useMemo, useRef, useState } from 'react'
import rawData from './data.json'
import * as LucideIcons from 'lucide-react'
import {
  Activity,
  Archive,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart,
  Book,
  BookOpen,
  Box,
  Braces,
  Brain,
  Brush,
  Camera,
  ChefHat,
  ClipboardList,
  Clock,
  Cloud,
  Cloudy,
  Code,
  Code2,
  Coffee,
  Compass,
  Cpu,
  Database,
  Disc,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  Feather,
  FileClock,
  FileCode,
  FileText as FilePdf,
  FileText,
  Film,
  Flame,
  FolderOpen,
  Gamepad,
  Gamepad2,
  GitBranch,
  Github,
  GitMerge,
  Globe,
  GraduationCap,
  HardDrive,
  Hash,
  Heart,
  HelpCircle,
  Home,
  Image,
  Key,
  Laptop,
  Layers,
  Layout,
  Leaf,
  Library,
  Link as LinkIcon,
  Lock,
  Map,
  MapPin,
  Maximize,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minimize2,
  Monitor,
  Moon,
  Music,
  Network,
  Book as Notebook,
  Package,
  Palette,
  Pen,
  PenTool,
  Play,
  PlayCircle,
  QrCode,
  Repeat,
  Rocket,
  School,
  Scissors,
  Search,
  SearchX,
  Shapes,
  Shell,
  Shield,
  ShieldCheck,
  Smartphone,
  Smile,
  Sparkles,
  Sun,
  Terminal,
  Wrench as Tool,
  Train,
  Tv,
  Type,
  Unlock,
  Utensils,
  Video,
  Wrench,
  Youtube,
  Zap,
  ShoppingBag
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface Link {
  name: string
  url: string
  description: string
  icon?: string
  tags?: string[]
  featured?: boolean
  hot?: boolean
  isNew?: boolean
}

interface Category {
  id: string
  title: string
  links: Link[]
}

const data = rawData as { categories: Category[] }

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getDomain(url: string) {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function getFaviconUrl(url: string) {
  const domain = getDomain(url)
  if (!domain) return ''
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
}

function Icon({ name, className }: { name?: string; className?: string }) {
  const LucideIcon = (name && (LucideIcons as any)[name]) || Globe
  return <LucideIcon className={className} size={18} />
}

function useTheme() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
    const next = saved ? saved === 'dark' : prefersDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
  }, [])

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return { isDark, toggle }
}

function LinkCard({ link }: { link: Link }) {
  const [faviconOk, setFaviconOk] = useState(true)
  const favicon = useMemo(() => getFaviconUrl(link.url), [link.url])
  const domain = useMemo(() => getDomain(link.url), [link.url])

  return (
    <motion.a
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur',
        'hover:border-blue-300/80 dark:hover:border-blue-800/60 hover:shadow-lg hover:shadow-blue-500/10',
        'transition-colors duration-200'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center">
            {favicon && faviconOk ? (
              <img
                src={favicon}
                alt=""
                className="h-7 w-7 rounded-md"
                onError={() => setFaviconOk(false)}
              />
            ) : (
              <Icon name={link.icon} className="text-gray-600 dark:text-gray-300" />
            )}

            {(link.hot || link.isNew) && (
              <span
                className={cn(
                  'absolute -right-1 -top-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  link.hot
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-500 text-white'
                )}
              >
                {link.hot ? 'HOT' : 'NEW'}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {link.name}
              </h3>
              <ArrowUpRight
                size={16}
                className="mt-0.5 shrink-0 text-gray-300 dark:text-neutral-700 group-hover:text-blue-500 transition-colors"
              />
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
              {link.description}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {(link.tags ?? []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 text-[11px] text-gray-600 dark:text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {domain ? (
                <span className="text-[11px] text-gray-400 dark:text-neutral-500 truncate max-w-[40%]">
                  {domain}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

function CategoryPanel({ category }: { category: Category }) {
  return (
    <section className="break-inside-avoid mb-4 rounded-2xl border border-white/25 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 dark:bg-white/10 text-gray-800 dark:text-gray-100">
            <Icon name={category.links[0]?.icon} />
          </span>
          <h2 className="font-semibold text-white/95 dark:text-white truncate">
            {category.title}
          </h2>
        </div>
        <span className="text-xs text-white/60 dark:text-white/50">{category.links.length}</span>
      </div>

      <div className="px-2 pb-3">
        <div className="space-y-1">
          {category.links.map((link) => (
            <a
              key={`${category.id}-${link.name}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
                'hover:bg-white/15 dark:hover:bg-white/10'
              )}
              title={link.description}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 dark:bg-white/10">
                <img
                  src={getFaviconUrl(link.url)}
                  alt=""
                  className="h-4 w-4 rounded"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                  }}
                />
              </span>
              <span className="text-sm text-white/90 dark:text-white truncate">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  const { isDark, toggle } = useTheme()
  const [activeCategory, setActiveCategory] = useState<string>(data.categories[0]?.id ?? '')
  const [searchQuery, setSearchQuery] = useState('')
  const categoryIds = useMemo(() => data.categories.map((c) => c.id), [])
  const isUserScrollingRef = useRef(false)
  const scrollTimerRef = useRef<number | null>(null)

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return data.categories
    return data.categories
      .map((cat) => ({
        ...cat,
        links: cat.links.filter((link) => {
          const hay = `${link.name} ${link.description} ${(link.tags ?? []).join(' ')}`
          return hay.toLowerCase().includes(q)
        }),
      }))
      .filter((cat) => cat.links.length > 0)
  }, [searchQuery])

  const totals = useMemo(() => {
    const linkCount = data.categories.reduce((acc, c) => acc + c.links.length, 0)
    return { categoryCount: data.categories.length, linkCount }
  }, [])

  const featuredLinks = useMemo(() => {
    const all = data.categories.flatMap((c) => c.links.map((l) => ({ ...l, _categoryId: c.id, _categoryTitle: c.title })))
    const featured = all.filter((l: any) => l.featured)
    const fallback = all.slice(0, 12)
    return (featured.length ? featured : fallback).slice(0, 12)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      isUserScrollingRef.current = true
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = window.setTimeout(() => {
        isUserScrollingRef.current = false
      }, 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const elements = categoryIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (!isUserScrollingRef.current) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]
        if (!visible?.target?.id) return
        setActiveCategory(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )

    elements.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [categoryIds])

  const scrollTo = (id: string) => {
    setActiveCategory(id)
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen text-white">
      <div
        className="fixed inset-0 z-[-1] transition-all duration-700 ease-in-out"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: isDark ? 'brightness(0.3) saturate(1.2)' : 'brightness(0.95) saturate(1.1)'
        }}
      />

      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 pt-5 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 hover:bg-white/15 transition-colors"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white font-bold">
                  卓
                </span>
                <span className="font-semibold tracking-tight hidden sm:inline">卓影童行</span>
              </a>

              <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
                <span>{totals.categoryCount} 分类</span>
                <span className="text-white/30">·</span>
                <span>{totals.linkCount} 资源</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 hover:bg-white/15 transition-colors"
                aria-label="切换主题"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 hover:bg-white/15 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入网站 / 标签 / 关键词，回车也不用"
                className={cn(
                  'w-full rounded-full bg-white/12 backdrop-blur-md border border-white/20',
                  'py-3 pl-11 pr-4 text-white placeholder:text-white/55 outline-none',
                  'focus:bg-white/15 focus:border-white/30 transition-colors'
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {data.categories.slice(0, 10).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => scrollTo(c.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm border backdrop-blur-md transition-colors',
                  activeCategory === c.id
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15 hover:text-white'
                )}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 space-y-4"
          >
            {filteredData.length === 0 ? (
              <section className="break-inside-avoid mb-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 text-center">
                <div className="mx-auto w-fit rounded-2xl bg-white/10 p-3">
                  <LucideIcons.SearchX size={24} className="text-white/70" />
                </div>
                <div className="mt-3 font-semibold">未找到相关资源</div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 rounded-xl bg-white/15 border border-white/20 px-4 py-2 hover:bg-white/20 transition-colors"
                >
                  清除搜索
                </button>
              </section>
            ) : null}

            {filteredData.length > 0 ? (
              <>
                <section className="break-inside-avoid mb-4 rounded-2xl border border-white/25 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 dark:bg-white/10">
                        <LucideIcons.Sparkles size={18} />
                      </span>
                      <div className="font-semibold text-white/95 dark:text-white truncate">推荐</div>
                    </div>
                    <span className="text-xs text-white/60 dark:text-white/50">{featuredLinks.length}</span>
                  </div>
                  <div className="px-3 pb-4">
                    <div className="grid grid-cols-1 gap-2">
                      {featuredLinks.slice(0, 8).map((l: any) => (
                        <a
                          key={`${l.name}-${l.url}`}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
                          title={l.description}
                        >
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 dark:bg-white/10">
                            <img
                              src={getFaviconUrl(l.url)}
                              alt=""
                              className="h-4 w-4 rounded"
                              onError={(e) => {
                                const t = e.currentTarget
                                t.style.display = 'none'
                              }}
                            />
                          </span>
                          <span className="text-sm text-white/90 dark:text-white truncate">{l.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </section>

                {filteredData.map((category) => (
                  <div key={category.id} id={category.id}>
                    <CategoryPanel category={category} />
                  </div>
                ))}
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="pb-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-xs text-white/50 flex items-center justify-between">
          <div>© 2026 卓影童行 | 司童 & 李函卓</div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-white/80 transition-colors"
          >
            回到顶部
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
