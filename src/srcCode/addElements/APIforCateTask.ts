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
    throw new Error('Undefined')
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
// category_id: selectOption?.value ? Number(selectOption.value) : undefined,
// si l'user choisi une categorie transforme la valeur de selectOption(ID) en nombre
// sinon c'est undefined

// seria legal se no reload da pagina eu conseguisse fazer que os dois IDs que eu salvei
// na minha base de dados carreguem juntos com as cores e tudo mais
