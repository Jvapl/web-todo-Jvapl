import { categoryColor, selectOption } from '../QuerySelector'
import type { NewCategorie } from '../types'
import { postCategoryAPI } from './APIcategories'
import { displayCategory } from './displayTaskAdd'

export const addACategorie = async (
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
    categoryTodo.push(finalCategory)
    displayCategory(finalCategory)
    if (selectOption && finalCategory) {
      const option = document.createElement('option')
      option.value = String(finalCategory.id)
      option.textContent = finalCategory.title
      selectOption.appendChild(option)
    }
    categoryInput.value = ''
    // categoryColor.value = '#FFFFFF'
  } catch (error) {
    console.error("the category wasn't add to API", error)
  }
}
