import {format} from 'date-fns'
import {es} from 'date-fns/locale'
import {getDay} from 'date-fns'

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
  console.log(date);
  
  let dateNew = date
  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number)
    dateNew = new Date(year, month - 1, day)
  }
  console.log(date,dateNew);

  return [
    {
      date: format(dateNew, 'yyyy-MM-dd'),
      label: format(dateNew, 'PPPP', {locale: es}),
      value: dateNew,
    },
  ]
}

// Función que retrocede una fecha hasta que sea día hábil (Lun-Vie)
function previousWeekday(date: Date): Date {
  const newDate = new Date(date)
  do {
    newDate.setDate(newDate.getDate() - 1)
  } while (getDay(newDate) === 0 || getDay(newDate) === 6) // 0=Domingo,6=Sábado
  return newDate
}

// Función que avanza una fecha hasta que sea día hábil (Lun-Vie)
function nextWeekday(date: Date): Date {
  const newDate = new Date(date)
  do {
    newDate.setDate(newDate.getDate() + 1)
  } while (getDay(newDate) === 0 || getDay(newDate) === 6)
  return newDate
}

export const generateDateOptions = () => {
  const today = new Date() // Ejemplo fijo
  const yesterday = previousWeekday(today)
  const tomorrow = nextWeekday(today)

  return [
    {date: yesterday, label: formatDate(yesterday), value: yesterday.toISOString().split('T')[0]},
    {date: today, label: formatDate(today), value: today.toISOString().split('T')[0]},
    {date: tomorrow, label: formatDate(tomorrow), value: tomorrow.toISOString().split('T')[0]},
  ]
}
