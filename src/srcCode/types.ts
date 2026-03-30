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

export const categoryTodo: NewCategorie[] = []
export const taskTodo: NewTask[] = []
//Je pourrais mettre les query dans ce meme fichier comme ça je besoin de faire des requetes
//sur ce fichier directement sans avoir besoin de reecrire le code
