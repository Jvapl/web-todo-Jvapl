import { taskTodo } from './main'
export const saveLocalStorage = () => {
  localStorage.setItem('taskTodo', JSON.stringify(taskTodo)) // Je transforme mes taskTodo en string et je le mets en format JSON dans mon local storage
}
