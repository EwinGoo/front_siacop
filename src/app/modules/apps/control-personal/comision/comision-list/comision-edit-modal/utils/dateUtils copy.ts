import {format} from 'date-fns'
import {es} from 'date-fns/locale'

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat('es-ES', options).format(date)
}

export const getDateOption = (date: string | Date) => {
  let dateNew = date
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number)
    dateNew = new Date(year, month - 1, day)
  }
  return [
    {
      date: format(dateNew, 'yyyy-MM-dd'),
      label: format(dateNew, 'PPPP', {locale: es}),
      value: dateNew,
    },
  ]
}

export const generateDateOptions = () => {
  const today = new Date()
  // const today = new Date('2025/08/11')
  // console.log(today,newtoday);
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return [
    {date: yesterday, label: formatDate(yesterday), value: yesterday.toISOString().split('T')[0]},
    {date: today, label: formatDate(today), value: today.toISOString().split('T')[0]},
    {date: tomorrow, label: formatDate(tomorrow), value: tomorrow.toISOString().split('T')[0]},
  ]
}
