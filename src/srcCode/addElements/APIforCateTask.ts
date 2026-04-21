import type { NewCategorieTask } from '../types'

const url = 'https://api.todos.in.jt-lab.ch/categories_todos'

export async function postCategoryAPI(associationToSent: NewCategorieTask) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(associationToSent),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Add association Error error:', error)
    throw new Error('Failed to create category-task association')
  }

  const result = await response.json()

  if (!result) throw new Error('Undefined')
  return result
}

export async function callAPICategoryTask() {
  const response = await fetch(url)
  if (!response.ok) {
    console.error('Recuperation category Error')
    throw new Error('Undefined')
  }
  const data = await response.json()

  return data
}