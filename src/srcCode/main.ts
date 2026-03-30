import '../disign/style.css'
import { deleteAPI } from './addElements/API'
import { addCategorie, addElement } from './addElements/addTodos'
import {
  buttonAdd,
  dateInput,
  deleteAllTodo,
  errorInput,
  inputTodo,
  todoElements,
} from './QuerySelector'
import { reloadPage } from './reloadPages'
import { categoryTodo, taskTodo } from './types'

const categoryInput = document.querySelector<HTMLInputElement>(
  '#category-name-input',
)
const categoryButtonAdd =
  document.querySelector<HTMLButtonElement>('#addCategoryButton')

if (!categoryButtonAdd || !categoryInput) {
  throw new Error("N'a pas trouvé l'element voulus")
}

reloadPage()

if (inputTodo && dateInput && errorInput && buttonAdd) {
  const input = inputTodo
  const date = dateInput
  const error = errorInput
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addElement(date, error, input, taskTodo)
    }
  })

  buttonAdd.addEventListener('click', () => {
    addElement(date, error, input, taskTodo)
  })
}

let isConfirming = false

if (deleteAllTodo && todoElements) {
  const btnDelete = deleteAllTodo
  const list = todoElements

  btnDelete.addEventListener('click', async () => {
    const warningTimeout = async () => {
      try {
        await deleteAPI(taskTodo)
        taskTodo.length = 0
      } catch (error) {
        console.error('Failed to delete all tasks:', error)
      }
      isConfirming = false
      btnDelete.textContent = 'Delete All'
      list.innerHTML = ''
    }
    let deleteTimer: number | undefined

    if (!isConfirming) {
      isConfirming = true
      btnDelete.textContent = 'Are you sure ?'
      btnDelete.classList.add('warning')
      setTimeout(warningTimeout, 3000)
    } else {
      clearTimeout(deleteTimer)
      warningTimeout()
      list.innerHTML = ''
    }
  })
}
categoryInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault() // prevents from the button and request firing twice
    addCategorie(errorInput as HTMLParagraphElement, categoryTodo)
  }
})
categoryButtonAdd.addEventListener('click', () => {
  addCategorie(errorInput as HTMLParagraphElement, categoryTodo)
})
