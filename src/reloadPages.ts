import { appelerAPI } from './dataFromAPI'
import { displayTask } from './displayTaskAdd'
import { taskTodo, todoElements } from './main'
import { updateOverdueAlert } from './overdueAlert'
import type { NewTask } from './types'

export const reloadPage = async () => {
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
}
