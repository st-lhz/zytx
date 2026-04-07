import React, { useState, useEffect } from 'react'
import { X, Save, Globe, Type, Tag, Layout } from 'lucide-react'
import { Link, Category } from '../types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface LinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (link: Partial<Link>) => Promise<void>
  initialData?: Partial<Link>
  categories: Category[]
}

export function LinkModal({ isOpen, onClose, onSave, initialData, categories }: LinkModalProps) {
  const [formData, setFormData] = useState<Partial<Link>>({
    name: '',
    url: '',
    description: '',
    category_id: '',
    tags: [],
    icon: 'Globe',
    ...initialData
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        url: '',
        description: '',
        category_id: categories[0]?.id || '',
        tags: [],
        icon: 'Globe',
        ...initialData
      })
    }
  }, [isOpen, initialData, categories])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      alert('保存失败，请检查网络')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput] })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layout className="text-blue-500" size={24} />
            {initialData?.id ? '编辑资源' : '添加新资源'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
              <Globe size={14} /> 网站链接 (URL)
            </label>
            <input
              required
              type="url"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none transition-all"
              placeholder="https://example.com"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
              <Type size={14} /> 网站名称
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none"
              placeholder="例如：Google"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
              <Layout size={14} /> 所属分类
            </label>
            <select
              value={formData.category_id}
              onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900">
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              网站描述
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none h-20 resize-none"
              placeholder="简单描述一下这个网站吧..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
              <Tag size={14} /> 标签 (回车或点击添加)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                placeholder="例如：工具, 免费, 极简"
              />
              <button 
                type="button" 
                onClick={addTag}
                className="px-4 py-2 bg-white/10 rounded-xl hover:bg-white/15"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              disabled={isSubmitting}
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 rounded-2xl font-semibold hover:bg-white/10 transition-all active:scale-95"
            >
              取消
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 rounded-2xl font-semibold hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? '正在保存...' : (
                <>
                  <Save size={18} />
                  <span>保存提交</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
