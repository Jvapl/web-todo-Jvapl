export const colorChangeDays = (selectedDate: string) => {
  const colorDay = [
    'var(--overdued-color-red)', //crée une variable avec une couleur OBS(c'est plus facile si je veux changer de couleur après)
    'var(--overdued-color-orange)',
    'var(--overdued-color-yellow)',
    'var(--overdued-color-green)',
  ]

  if (selectedDate && selectedDate !== 'No due date') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const target = new Date(selectedDate)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return colorDay[0]
    if (diffDays === 0) return colorDay[1]
    if (diffDays <= 4) return colorDay[2]
    return colorDay[3]
  }
  return ''
}
