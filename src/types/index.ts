export interface Link {
  id?: string
  category_id?: string
  name: string
  url: string
  description: string
  icon?: string
  tags?: string[]
  featured?: boolean
  hot?: boolean
  is_new?: boolean
  order?: number
}

export interface Category {
  id: string
  slug: string
  title: string
  links: Link[]
  order?: number
}
