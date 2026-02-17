import './style.css'
const inputTodo = document.querySelector<HTMLInputElement>('#todo-input')
const buttonAdd = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoElements = document.querySelector<HTMLUListElement>('#todo-elements')
const errorInput = document.querySelector<HTMLParagraphElement>('#error')

interface TaskType {
  id: number
  name: string
}
const taskTodo: TaskType[] = []

if (!inputTodo || !buttonAdd || !todoElements || !errorInput) {
  throw new Error(
    "Didn't find one or many DOM elements. Verify the IDs from index.html.", //
  )
}

const displayTask = (text: TaskType) => {
  const newLi = document.createElement('li')
  newLi.textContent = text.name
  todoElements.appendChild(newLi)
}

const reload = localStorage.getItem('taskTodo')
if (reload) {
  try {
    const savedTasks: TaskType[] = JSON.parse(reload)
    taskTodo.push(...savedTasks)
    taskTodo.forEach((taskText) => {
      displayTask(taskText)
    })
  } catch (e) {
    console.error('Failed to parse tasks from localStorage', e)
    localStorage.removeItem('taskTodo')
  }
}

const addElement = () => {
  const text: string = inputTodo.value.trim()
  if (!text) {
    errorInput.removeAttribute('hidden')
    return
  }
  const newTask: TaskType = { id: Date.now(), name: text }
  errorInput.setAttribute('hidden', '')
  displayTask(newTask)
  taskTodo.push(newTask)
  inputTodo.value = ''
  const tasksJson = JSON.stringify(taskTodo)
  localStorage.setItem('taskTodo', tasksJson)
}

inputTodo.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addElement()
  }
})
buttonAdd.addEventListener('click', () => {
  addElement()
})
