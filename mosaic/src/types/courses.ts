export interface Course {
  id: string
  title: string
  language: string
  flag: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  lessons: number
  students: number
  rating: number
  price: number
  originalPrice?: number
  image: string
  description: string
  features: string[]
  instructor: {
    name: string
    avatar: string
    specialization: string
  }
  progress?: number // для начатых курсов
  isFeatured?: boolean
  category: 'grammar' | 'conversation' | 'business' | 'exam' | 'travel'
}

export interface FilterOptions {
  languages: string[]
  levels: string[]
  categories: string[]
  duration: string[]
}