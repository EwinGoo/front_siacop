export class ValidationError extends Error {
  constructor(
    public validationErrors: Record<string, string>,
    public message: string = 'Error de validación'
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}