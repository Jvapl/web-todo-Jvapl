export interface NewTask {
  id?: number
  title: string
  content: string
  done: boolean
  due_date: string | null
}

export interface NewCategorie {
  id?: number
  title: string
  color: string
}

export interface NewCategorieTask {
  category_id: number
  todo_id: number
}

export const categoryTodo: NewCategorie[] = []
export const taskTodo: NewTask[] = []
export const BothTC: NewCategorieTask[] = []

