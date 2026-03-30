import { categoryColor } from '../QuerySelector'
import { updateOverdueAlert } from '../reloadPages'
import type { NewCategorie, NewTask } from '../types'
import { postDataAPI } from './API'
import { postCategoryAPI } from './APIcategories'
import { displayCategory, displayTask } from './displayTaskAdd'

export const addElement = async (
  dateInput: HTMLInputElement,
  errorInput: HTMLParagraphElement,
  inputTodo: HTMLInputElement,
  taskTodo: NewTask[],
) => {
  const text: string = inputTodo.value.trim()
  if (!text) {
    errorInput.textContent = 'Please enter a task !!'
    errorInput.removeAttribute('hidden')
    return
  }

  const currentDate = new Date().toISOString().split('T')[0]
  if (dateInput.value && dateInput.value < currentDate) {
    errorInput.textContent = 'Choose a valid date !!'
    errorInput.removeAttribute('hidden')
    return
  }
  errorInput.setAttribute('hidden', '')
  const taskToSent: NewTask = {
    title: text,
    content: text,
    done: false,
    due_date: dateInput.value || null,
  }
  try {
    const fromServer = await postDataAPI(taskToSent)
    const serverData = Array.isArray(fromServer) ? fromServer[0] : fromServer
    const finalTask = serverData.id && serverData ? serverData : taskToSent
    if (!finalTask) {
      console.error('Failed to save the task to the server.')
      return
    }
    //Demande si l'objets qu'on a
    //reçu a un id si oui envoie fromServer sinon taskToSent
    taskTodo.push(finalTask)
    displayTask(finalTask)
    dateInput.value = ''
    inputTodo.value = ''
    updateOverdueAlert()
  } catch (error) {
    console.error("the task wasn't add to API", error)
  }
}

export const addCategorie = async (
  errorInput: HTMLParagraphElement,
  categoryTodo: NewCategorie[],
) => {
  const categoryInput = document.querySelector<HTMLInputElement>(
    '#category-name-input',
  )

  if (!categoryInput || !categoryColor) {
    throw new Error(
      "Didn't find one or many DOM elements. Verify the IDs from index.html.",
    )
  }

  const text: string = categoryInput.value.trim()
  if (!text) {
    errorInput.textContent = 'Please enter a category !!'
    errorInput.removeAttribute('hidden')
    return
  }
  errorInput.setAttribute('hidden', '')
  const categoriesSent: NewCategorie = {
    title: text,
    color: categoryColor.value,
  }
  try {
    const fromServer = await postCategoryAPI(categoriesSent)
    const serverData = Array.isArray(fromServer) ? fromServer[0] : fromServer
    const finalCategory =
      serverData.id && serverData ? serverData : categoriesSent
    if (!finalCategory) {
      console.error('Failed to save the category to the server.')
      return
    }
    //Demande si l'objets qu'on a
    //reçu a un id si oui envoie fromServer sinon taskToSent
    categoryTodo.push(finalCategory) //Je dois faire un debug pour faire en sorte que je puisse ajouter correctement le task
    displayCategory(finalCategory) // c'est la que ça ne marche pas
    categoryInput.value = ''
    // categoryColor.value = '#FFFFFF'
  } catch (error) {
    console.error("the category wasn't add to API", error)
  }
}
