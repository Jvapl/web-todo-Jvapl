import './style.css'
const inputTodo = document.querySelector<HTMLInputElement>('#todo-input')
const buttonAdd = document.querySelector<HTMLButtonElement>('#add-todo-button')
const todoElements = document.querySelector<HTMLUListElement>('#todo-elements')
const errorInput = document.querySelector<HTMLParagraphElement>('#error')
const taskTodo: TaskType[] = []

// Crée un type
interface TaskType {
  id: number
  name: string
  verify: boolean
}

// Check si touts mes elements existent vraiment dans mon HTML
if (!inputTodo || !buttonAdd || !todoElements || !errorInput) {
  throw new Error(
    "Didn't find one or many DOM elements. Verify the IDs from index.html.", //
  )
}

const saveLocalStorage = () => {
  localStorage.setItem('taskTodo', JSON.stringify(taskTodo))
}

// crée ma todo comme une liste
const displayTask = (text: TaskType) => {
  const newLi = document.createElement('li') //label + input("checkBox") -> span + les li
  const spanCreated = document.createElement('span')
  const statusCheck = document.createElement('label')
  const checkBox = document.createElement('input')

  let status11 = 'Uncompleted'
  statusCheck.textContent = status11
  newLi.id = 'task-to-do'
  spanCreated.id = 'aa'
  checkBox.type = 'checkbox'

  const statusBox = () => {
    if (checkBox.checked) {
      status11 = 'Completed'
      statusCheck.textContent = status11
      spanCreated.style.color = '#00F000'
      saveLocalStorage()
    } else {
      status11 = 'Uncompleted'
      statusCheck.textContent = status11
      spanCreated.style.color = ''
    }
  }

  checkBox.addEventListener('change', () => {
    text.verify = checkBox.checked
    statusBox()
  })
  checkBox.checked = text.verify
  statusBox()
  newLi.textContent = text.name
  newLi.appendChild(spanCreated)
  todoElements.appendChild(newLi)
  spanCreated.appendChild(statusCheck)
  spanCreated.appendChild(checkBox)
  saveLocalStorage()
  // je dois crée une variable que verifie si ma checkBox est déjà cochée
}

// Mon reload est pour que quand ça reload la page ça recharge tout
// ce que le user a input stocké dans le localStorage et envoie aussi une erreur
// quand il n'arrive pas a faire ça.
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

// J'ajoute un element comme une liste avec ce que l'user a input et je transforme
// ce qu'il a ecrit dans l'input en JSON pour stoquer dans localStorage.
const addElement = () => {
  const text: string = inputTodo.value.trim()
  if (!text) {
    errorInput.removeAttribute('hidden')
    return
  }

  const newTask: TaskType = {
    id: Date.now(),
    name: text,
    verify: false,
  }
  errorInput.setAttribute('hidden', '')
  displayTask(newTask)
  taskTodo.push(newTask)
  inputTodo.value = ''
  const tasksJson = JSON.stringify(taskTodo)
  localStorage.setItem('taskTodo', tasksJson)
}

// Les deux principaux "boutons" pour que quand je clique ça execute la fonction et ajoute les todos.
inputTodo.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addElement()
  }
})
buttonAdd.addEventListener('click', () => {
  addElement()
})
