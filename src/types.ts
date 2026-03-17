export interface NewTask {
  id?: number
  title: string
  content: string
  done: boolean
  due_date: string | null
}
