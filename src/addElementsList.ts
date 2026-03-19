import { postDataAPI } from './dataFromAPI'
import { displayTask } from './displayTaskAdd'
import { dateInput, errorInput, inputTodo, taskTodo } from './main'
import { updateOverdueAlert } from './overdueAlert'
import type { NewTask } from './types'

export const addElement = async () => {
  if (!inputTodo || !errorInput || !dateInput) {
    throw new Error(
      "Didn't find one or many DOM elements. Verify the IDs from index.html.",
    )
  }
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
    const finalTask = fromServer.id ? fromServer : taskToSent
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
