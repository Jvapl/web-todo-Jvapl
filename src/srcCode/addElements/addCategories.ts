// Je pourrais essayer de faire genre de mettre ça comme parametre d'une function
// pour que j'en ayes rien a faire a propos
// interface AddConfig<T, R> {
//   input: HTMLParagraphElement
//   errorElement: HTMLParagraphElement
//   apiCall: (data: T) => Promise<R> //Donne prends une valeur T et promets un valeur R en retour
//   onSuccess: (result: R) => void //Callback
//   buildData: (text: string) => T
// }

// ------------ essayage d'un autre type de funtion

// useless if statement

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
