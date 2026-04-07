import { useEffect, useMemo, useRef, useState } from 'react'
import * as LucideIcons from 'lucide-react'
import {
  // ... (keeping existing icons)
  Activity, Archive, ArrowLeftRight, ArrowUpRight, BarChart, Book, BookOpen, Box, Braces, Brain, Brush, Camera, ChefHat, ClipboardList, Clock, Cloud, Cloudy, Code, Code2, Coffee, Compass, Cpu, Database, Disc, Download, Edit3, ExternalLink, Eye, Feather, FileClock, FileCode, FileText as FilePdf, FileText, Film, Flame, FolderOpen, Gamepad, Gamepad2, GitBranch, Github, GitMerge, Globe, GraduationCap, HardDrive, Hash, Heart, HelpCircle, Home, Image, Key, Laptop, Layers, Layout, Leaf, Library, Link as LinkIcon, Lock, Map, MapPin, Maximize, Menu, MessageCircle, MessageSquare, Mic, Minimize2, Monitor, Moon, Music, Network, Book as Notebook, Package, Palette, Pen, PenTool, Play, PlayCircle, QrCode, Repeat, Rocket, School, Scissors, Search, SearchX, Shapes, Shell, Shield, ShieldCheck, Smartphone, Smile, Sparkles, Sun, Terminal, Wrench as Tool, Train, Tv, Type, Unlock, Utensils, Video, Wrench, Youtube, Zap, ShoppingBag,
  Settings, Save, Trash2, Plus, X, Loader2
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Category, Link } from './types'
import { dataService } from './services/dataService'
import { LinkModal } from './components/LinkModal'

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

function LinkCard({ link, isAdmin, onDelete }: { link: Link, isAdmin?: boolean, onDelete?: (id: string) => void }) {
  const [faviconOk, setFaviconOk] = useState(true)
  const favicon = useMemo(() => getFaviconUrl(link.url), [link.url])
  const domain = useMemo(() => getDomain(link.url), [link.url])

  return (
    <motion.div
      layout
      className="relative"
    >
      <motion.a
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'block group rounded-2xl border border-gray-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur',
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

              {(link.hot || link.is_new) && (
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

      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); onDelete?.(link.id!); }}
            className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

function CategoryPanel({ category, isAdmin, onDelete, onEdit, onAddLink, isActive }: { category: Category, isAdmin?: boolean, onDelete?: (id: string) => void, onEdit?: (link: Link) => void, onAddLink?: (categoryId: string) => void, isActive?: boolean }) {
  return (
    <section 
      className={cn(
        "break-inside-avoid mb-4 rounded-2xl border backdrop-blur-md transition-all duration-300",
        isActive 
          ? "border-blue-500/50 bg-blue-500/[0.03] ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10" 
          : "border-white/25 dark:border-white/10 bg-white/10 dark:bg-black/20"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 relative">
        {isActive && (
          <motion.div 
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50"
          />
        )}
        <div className={cn("flex items-center gap-2 min-w-0 transition-transform", isActive && "translate-x-1")}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 dark:bg-white/10 text-gray-800 dark:text-gray-100">
            <Icon name={category.links[0]?.icon} />
          </span>
          <h2 className="font-semibold text-white/95 dark:text-white truncate">
            {category.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
           {isAdmin && (
             <button 
               onClick={() => onAddLink?.(category.id)}
               className="p-1 text-emerald-400 hover:scale-110 transition-transform"
               title="在此分类下添加资源"
             >
               <Plus size={16} />
             </button>
           )}
           <span className="text-xs text-white/60 dark:text-white/50">{category.links.length}</span>
        </div>
      </div>

      <div className="px-2 pb-3">
        <div className="space-y-1">
          {category.links.map((link) => (
            <div key={link.id} className="group relative flex items-center">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex-1 flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
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
              {isAdmin && (
                <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                  <button 
                    onClick={() => onEdit?.(link)}
                    className="p-1 text-blue-400 hover:text-blue-500"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button 
                    onClick={() => onDelete?.(link.id!)}
                    className="p-1 text-rose-400 hover:text-rose-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  const { isDark, toggle } = useTheme()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Partial<Link> | undefined>()
  
  const categoryIds = useMemo(() => categories.map((c) => c.slug), [categories])
  const isUserScrollingRef = useRef(false)
  const scrollTimerRef = useRef<number | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      const data = await dataService.fetchAllData()
      setCategories(data)
      if (data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].slug)
      }
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const savedAdmin = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(savedAdmin)
  }, [])

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return categories
    return categories
      .map((cat) => ({
        ...cat,
        links: cat.links.filter((link) => {
          const hay = `${link.name} ${link.description} ${(link.tags ?? []).join(' ')}`
          return hay.toLowerCase().includes(q)
        }),
      }))
      .filter((cat) => cat.links.length > 0)
  }, [searchQuery, categories])

  const totals = useMemo(() => {
    const linkCount = categories.reduce((acc, c) => acc + c.links.length, 0)
    return { categoryCount: categories.length, linkCount }
  }, [categories])

  const featuredLinks = useMemo(() => {
    const all = categories.flatMap((c) => c.links.map((l) => ({ ...l, _categoryId: (l as any).category_id, _categoryTitle: c.title })))
    const featured = all.filter((l: any) => l.featured)
    const fallback = all.slice(0, 12)
    return (featured.length ? featured : fallback).slice(0, 12)
  }, [categories])

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
      { rootMargin: '-10% 0px -80% 0px', threshold: [0, 0.5, 1] }
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

  const handleDeleteLink = async (id: string) => {
    if (!confirm('确定要删除这个资源吗？')) return
    try {
      await dataService.deleteLink(id)
      setCategories(prev => prev.map(cat => ({
        ...cat,
        links: cat.links.filter(l => l.id !== id)
      })))
    } catch (err) {
      alert('删除失败')
    }
  }

  const handleEditLink = (link: Link) => {
    setEditingLink(link)
    setIsModalOpen(true)
  }

  const handleAddLink = (categoryId?: string) => {
    setEditingLink(categoryId ? { category_id: categoryId } : undefined)
    setIsModalOpen(true)
  }

  const handleSaveLink = async (link: Partial<Link>) => {
    try {
      if (link.id) {
        await dataService.updateLink(link.id, link)
      } else {
        await dataService.addLink(link)
      }
      await loadData()
      setIsModalOpen(false)
    } catch (err) {
      console.error('保存失败:', err)
      throw err
    }
  }

  const handleAddCategory = async () => {
    const title = prompt('请输入新分类名称 (例如: 学习资源)')
    if (!title) return
    const slug = prompt('请输入新分类的标识 (英文/拼音, 例如: study)')
    if (!slug) return
    
    try {
      setIsLoading(true)
      await dataService.addCategory(title, slug)
      await loadData()
    } catch (err) {
      alert('添加分类失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = () => {
    const pwd = prompt('请输入管理员密码')
    if (pwd === 'admin123') { 
      setIsAdmin(true)
      localStorage.setItem('isAdmin', 'true')
    } else {
      alert('密码错误')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('isAdmin')
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="mt-4 text-zinc-400 font-medium">正在连接云端数据库...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden">
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
                onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                {isAdmin && (
                  <span className="ml-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400 uppercase font-bold tracking-wider"> Admin </span>
                )}
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
              
              <button
                type="button"
                onClick={isAdmin ? handleLogout : handleLogin}
                className={cn(
                  "inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 hover:bg-white/15 transition-colors",
                  isAdmin && "text-emerald-400 border-emerald-500/30"
                )}
                title={isAdmin ? "退出后台" : "管理员登录"}
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入网站 / 标签 / 关键词，查询云端全球资源"
                className={cn(
                  'w-full rounded-full bg-white/12 backdrop-blur-md border border-white/20',
                  'py-3 pl-11 pr-4 text-white placeholder:text-white/55 outline-none',
                  'focus:bg-white/15 focus:border-white/30 transition-colors'
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto pb-2 noscrollbar">
            {categories.slice(0, 10).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => scrollTo(c.slug)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm border backdrop-blur-md transition-colors',
                  activeCategory === c.slug
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15 hover:text-white'
                )}
              >
                {c.title}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={handleAddCategory}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
                title="新增分类"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchQuery + categories.length}
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
                <section className="break-inside-avoid mb-4 rounded-2xl border border-white/25 dark:border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md overflow-hidden">
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
                    <div className="grid grid-cols-1 gap-1">
                      {featuredLinks.slice(0, 8).map((l: any) => (
                        <div
                          key={`${l.name}-${l.url}`}
                          className="flex items-center justify-between group rounded-xl px-3 py-2 hover:bg-white/15 dark:hover:bg-white/10 transition-colors"
                        >
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 overflow-hidden flex-1"
                            title={l.description}
                          >
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 dark:bg-white/10 flex-shrink-0">
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
                          {isAdmin && (
                             <button onClick={(e) => { e.preventDefault(); handleDeleteLink(l.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:text-rose-500 transition-opacity">
                               <Trash2 size={12} />
                             </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {filteredData.map((category) => (
                  <div key={category.id} id={category.slug}>
                    <CategoryPanel 
                      category={category} 
                      isAdmin={isAdmin} 
                      onDelete={handleDeleteLink} 
                      onEdit={handleEditLink}
                      onAddLink={handleAddLink}
                      isActive={activeCategory === category.slug}
                    />
                  </div>
                ))}
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>

      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
           <button 
             className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
             onClick={() => handleAddLink()}
           >
             <Plus size={20} />
             <span>添加资源</span>
           </button>
        </div>
      )}

      {/* 编辑弹窗 */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        initialData={editingLink}
        categories={categories}
      />

      <footer className="pb-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-xs text-white/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span>© 2026 卓影童行 | 司童 & 李函卓</span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Supabase 云端版</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white/80 transition-colors"
            >
              回到顶部
            </button>
            <a href="https://github.com" target="_blank" className="hover:text-white/80 transition-colors">源码仓库</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
