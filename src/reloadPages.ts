import { displayTask } from './displayTaskAdd'
import { taskTodo } from './main'
import { updateOverdueAlert } from './overdueAlert'
import type { TaskType } from './types'

export const reloadPage = () => {
  const reload = localStorage.getItem('taskTodo')
  if (reload) {
    try {
      const savedTasks: TaskType[] = JSON.parse(reload)
      taskTodo.push(...savedTasks)
      taskTodo.forEach((taskText) => {
        displayTask(taskText)
      })
      updateOverdueAlert()
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e)
      localStorage.removeItem('taskTodo')
    }
  }
}
