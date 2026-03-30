import { appelerAPI } from './addElements/API'
import { appelerAPICategory } from './addElements/APIcategories'
import { displayCategory, displayTask } from './addElements/displayTaskAdd'
import { categoriesElements, todoElements } from './QuerySelector'
import type { NewCategorie, NewTask } from './types'
import { categoryTodo, taskTodo } from './types'

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
  // Ce fichier aussi je dois le changer

  if (!todoElements) {
    throw new Error(
      "Couldn't find the 'todo-elements' DOM element. Verify the ID in index.html",
    )
  }
  try {
    const savedTasks: NewTask[] | undefined = await appelerAPI() //comme ça ne peut pas retourner undefined
    if (savedTasks) {
      taskTodo.length = 0
      todoElements.innerHTML = ''
      taskTodo.push(...savedTasks)
    }
    taskTodo.forEach((taskText) => {
      displayTask(taskText)
    })
    updateOverdueAlert()
  } catch (e) {
    console.error('Failed to parse tasks from database', e)
  }
  if (!categoriesElements) {
    throw new Error("didn't find any categories")
  }
  try {
    const savedCategories: NewCategorie[] | undefined =
      await appelerAPICategory()
    if (savedCategories) {
      categoryTodo.length = 0
      categoriesElements.innerHTML = ''
      categoryTodo.push(...savedCategories)
    }
    categoryTodo.forEach((categorieText) => {
      displayCategory(categorieText)
    })
  } catch (e) {
    console.error('Failed to parse categories from database', e)
  }
}

//prendre exemple du code de Ryan avec son if sur le main
//avec un if pour que je check et stocke avec le bon URl
