import './style.css'
import { addElement } from './addElementsList'
import { deleteAPI } from './dataFromAPI'
import { updateOverdueAlert } from './overdueAlert'
import { reloadPage } from './reloadPages'
import type { newTask } from './types'

export const deleteAllTodo = document.querySelector<HTMLButtonElement>(
  '#task-to-do__remove-All-button',
)
export const buttonAdd =
  document.querySelector<HTMLButtonElement>('#add-todo-button')
export const todoElements =
  document.querySelector<HTMLUListElement>('#todo-elements')
export const errorInput = document.querySelector<HTMLParagraphElement>('#error')
export const inputTodo = document.querySelector<HTMLInputElement>('#todo-input')
export const dateInput =
  document.querySelector<HTMLInputElement>('#todo-date-input')

export const taskTodo: newTask[] = []

// Crée un type
if (
  !inputTodo ||
  !buttonAdd ||
  !todoElements ||
  !errorInput ||
  !deleteAllTodo
) {
  throw new Error(
    "Didn't find one or many DOM elements. Verify the IDs from index.html.",
  )
}
if (!dateInput) {
  throw new Error(
    "Could't find the 'todo-date-input DOM element. Verify the ID in index.html",
  )
}

updateOverdueAlert()
reloadPage()

inputTodo.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addElement()
  }
})
buttonAdd.addEventListener('click', addElement)

let isConfirming = false

deleteAllTodo.addEventListener('click', async () => {
  const warningTimeout = async () => {
    await deleteAPI(taskTodo) //trouver l'id stocké dans ma base de donnée et essayer de delete
    //  les informations stockée
    taskTodo.length = 0
    isConfirming = false
    deleteAllTodo.textContent = 'Delete All'
    todoElements.innerHTML = ''
  }
  if (!isConfirming) {
    isConfirming = true
    deleteAllTodo.textContent = 'Are you sure ?'
    deleteAllTodo.classList.add('warning')
    setTimeout(warningTimeout, 3000)
  } else {
    warningTimeout()
    todoElements.innerHTML = ''
  }
})
