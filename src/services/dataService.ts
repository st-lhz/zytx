import { supabase } from '../lib/supabase'
import { Category } from '../types'

export const dataService = {
  async fetchAllData(): Promise<Category[]> {
    // 1. 获取所有分类
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true })

    if (catError) throw catError

    // 2. 获取所有链接
    const { data: links, error: linkError } = await supabase
      .from('links')
      .select('*')
      .order('order', { ascending: true })

    if (linkError) throw linkError

    // 3. 组装数据 (将链接归类到分类下)
    return categories.map(cat => ({
      ...cat,
      links: links.filter(l => l.category_id === cat.id)
    }))
  },

  async deleteLink(id: string) {
    const { error } = await supabase.from('links').delete().eq('id', id)
    if (error) throw error
  },

  async updateLink(id: string, updates: any) {
    const { error } = await supabase
      .from('links')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    if (error) throw error
  },

  async addLink(link: any) {
    const { error } = await supabase
      .from('links')
      .insert({
        ...link,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    if (error) throw error
  },

  async addCategory(title: string, slug: string) {
    const { error } = await supabase
      .from('categories')
      .insert({
        title,
        slug,
        order: 999 // 默认排在最后
      })
    if (error) throw error
  }
}
