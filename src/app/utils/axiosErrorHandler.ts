export const getAxiosErrorMessage = (error: any): string => {
  if (error.response) {
    if (error.response.status === 404) {
      return 'La comisión no fue encontrada en el sistema'
    }

    if (error.response.data?.message) {
      return error.response.data.message
    }

    if (error.response.data?.validation_errors) {
      return Object.values(error.response.data.validation_errors).join('\n')
    }
  }
  if (error) {
    return error
  }

  return 'Error al procesar la solicitud'
}

// export const handleApiError = (error: any) => {
//   console.error(error);
  
//   if (error.response?.status === 422 && error.response.data?.validation_errors) {
//     setBackendErrors(error.response.data.validation_errors);
//     toast.error(error.response.data.message);
//   } else {
//     toast.error(error.message || 'Ocurrió un error inesperado');
//   }
// };