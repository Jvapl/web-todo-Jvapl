import { appelerAPI } from './addElements/API'
import { appelerAPICategory } from './addElements/APIcategories'
import { callAPICategoryTask } from './addElements/APIforCateTask'
import {
  displayCategory,
  displayTask,
  updateCategorySelect,
} from './addElements/displayTaskAdd'
import { categoriesElements, selectOption, todoElements } from './QuerySelector'
import type { NewCategorie, NewCategorieTask, NewTask } from './types'
import { BothTC, categoryTodo, taskTodo } from './types'

// MSG - de Overdue une tache qui est en retard
export const updateOverdueAlert = () => {
  const overdueMsg =
    document.querySelector<HTMLParagraphElement>('#overdue-message')
  if (!overdueMsg) return

  const today = new Date()
  today.setHours(0, 0, 0, 0) // mets l'heure a 00:00

  const UrgentOverdue = taskTodo.some((task) => {
    // .some Est une commende qui fais le cacul et return true ou false
    if (!task.due_date || task.due_date === 'No due date') return false

    const target = new Date(task.due_date)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) // arrondi mon nombre en jours

    return diffDays <= 4 && !task.done //return que les nombres qui sont plus petit ou egaux a 4 sinon il retourne "no due date" si zero inputDate
  })

  if (UrgentOverdue) {
    overdueMsg.removeAttribute('hidden')
  } else {
    overdueMsg.setAttribute('hidden', '')
  }
}

// RELOAD --

export const reloadPage = async () => {
  if (!todoElements || !categoriesElements || !selectOption) {
    throw new Error("Couldn't find required DOM elements. Verify index.html")
  }
  try {
    const savedCategories: NewCategorie[] | undefined =
      await appelerAPICategory()
    if (savedCategories) {
      categoryTodo.length = 0
      categoriesElements.innerHTML = ''
      categoryTodo.push(...savedCategories)
      categoryTodo.forEach((categorieText) => {
        displayCategory(categorieText)
      })
      updateCategorySelect(categoryTodo)
    }

    const savedAssociations: NewCategorieTask[] | undefined =
      await callAPICategoryTask()
    if (savedAssociations) {
      BothTC.length = 0
      BothTC.push(...savedAssociations)
    }

    const savedTasks: NewTask[] | undefined = await appelerAPI()
    if (savedTasks) {
      taskTodo.length = 0
      todoElements.innerHTML = ''
      taskTodo.push(...savedTasks)
      taskTodo.forEach((taskText) => {
        displayTask(taskText)
      })
    }

    updateOverdueAlert()
  } catch (e) {
    console.error('Failed to reload page data', e)
  }
}
