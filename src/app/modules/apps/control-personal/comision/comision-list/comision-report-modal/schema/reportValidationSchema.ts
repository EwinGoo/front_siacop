import * as Yup from 'yup'

export const reportValidationSchema = Yup.object().shape({
  fechaInicio: Yup.date()
    .required('La fecha de inicio es requerida')
    .max(new Date(), 'La fecha de inicio no puede ser futura')
    .test(
      'fecha-inicio-valida',
      'La fecha de inicio no puede ser mayor a la fecha de fin',
      function (value) {
        const { fechaFin } = this.parent
        if (!value || !fechaFin) return true
        return new Date(value) <= new Date(fechaFin)
      }
    ),
    
  fechaFin: Yup.date()
    .required('La fecha de fin es requerida')
    .max(new Date(), 'La fecha de fin no puede ser futura')
    .test(
      'fecha-fin-valida',
      'La fecha de fin no puede ser menor a la fecha de inicio',
      function (value) {
        const { fechaInicio } = this.parent
        if (!value || !fechaInicio) return true
        return new Date(value) >= new Date(fechaInicio)
      }
    )
    .test(
      'rango-maximo',
      'El rango de fechas no puede ser mayor a 1 año',
      function (value) {
        const { fechaInicio } = this.parent
        if (!value || !fechaInicio) return true
        
        const inicio = new Date(fechaInicio)
        const fin = new Date(value)
        const diffTime = fin.getTime() - inicio.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        return diffDays <= 365
      }
    ),
    
  tipoComision: Yup.string().required('Debe seleccionar un tipo de permiso'),
})
