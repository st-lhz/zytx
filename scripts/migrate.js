import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch, { Headers, Request, Response } from 'cross-fetch'
import dotenv from 'dotenv'

// 加载 .env 文件
dotenv.config()

// 针对 Node 16 版本的 Headers / fetch 补丁
if (!global.fetch) {
  global.fetch = fetch
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
}

// 获取当前目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- 从环境变量获取 Supabase 信息 ---
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
// -----------------------------

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ 错误：缺少环境变量 VITE_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY')
  console.error('👉 请确保您的 .env 文件中已配置这两个字段。')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function migrate() {
  try {
    console.log('🚀 开始重新全量同步数据...')

    // 1. 读取 data.json
    const dataPath = path.resolve(__dirname, '../src/data.json')
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    const { categories } = rawData

    // 2. 🧹 清理旧数据 (确保不重复)
    console.log('🧹 正在清理数据库旧数据，准备重新同步...')
    await supabase.from('links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      console.log(`📦 正在处理分类: ${cat.title} (${cat.id})...`)

      // 插入分类
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .upsert({
          slug: cat.id,
          title: cat.title,
          order: i
        })
        .select()
        .single()

      if (catError) {
        console.error(`❌ 分类 ${cat.title} 插入失败:`, catError.message)
        continue
      }

      // 插入该分类下的所有链接
      const linksToInsert = cat.links.map((link, index) => ({
        category_id: catData.id,
        name: link.name,
        url: link.url,
        description: link.description,
        icon: link.icon,
        tags: link.tags || [],
        featured: !!link.featured,
        hot: !!link.hot,
        is_new: !!link.isNew,
        order: index
      }))

      const { error: linksError } = await supabase
        .from('links')
        .insert(linksToInsert)

      if (linksError) {
        console.error(`❌ 分类 ${cat.title} 下的链接插入失败:`, linksError.message)
      } else {
        console.log(`✅ 分类 ${cat.title} 及其 ${linksToInsert.length} 个链接同步成功`)
      }
    }

    console.log('\n✨ 所有数据迁移完成！您现在可以在 Supabase 后台查看数据了。')
  } catch (err) {
    console.error('💥 迁移过程中发生错误:', err)
  }
}

migrate()
