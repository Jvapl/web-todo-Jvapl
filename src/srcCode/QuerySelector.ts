export function queryElement<T extends HTMLElement>(
  selector: string,
): T | null {
  return document.querySelector<T>(selector)
}
export function getRequiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Required element not found: ${selector}`)
  }
  return element
}

export const deleteAllTodo = queryElement<HTMLButtonElement>(
  '#task-to-do__remove-All-button',
)
export const buttonAdd = queryElement<HTMLButtonElement>('#add-todo-button')
export const todoElements = queryElement<HTMLUListElement>('#todo-elements')
export const errorInput = queryElement<HTMLParagraphElement>('.error')
export const inputTodo = queryElement<HTMLInputElement>('#todo-input')
export const dateInput = queryElement<HTMLInputElement>('#todo-date-input')
export const categoriesElements = queryElement<HTMLInputElement>(
  '#categories-elements',
)
export const categoryColor = queryElement<HTMLInputElement>(
  '#category-color-input',
)

export const selectOption = queryElement<HTMLSelectElement>(
  '#associate_categories_tasks',
)
