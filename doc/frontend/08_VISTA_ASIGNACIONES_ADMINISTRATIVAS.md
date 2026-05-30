# Vista: Asignaciones Administrativas

## Qué hace la vista

Lista las asignaciones administrativas y permite:

- buscar por persona, CI, cargo o memorándum
- crear, editar y eliminar asignaciones
- cambiar rápidamente el tipo de horario desde la tabla

## Qué datos muestra

- persona
- CI
- POA
- tipo de contratación
- cargo
- fecha de inicio
- horario actual
- estado de la asignación

## Qué acciones permite

- búsqueda paginada
- alta de asignación administrativa
- edición completa de la asignación
- eliminación
- cambio inline de `id_horario_tipo` usando un `select` en acciones

## Endpoints que consume

- `GET /api/v1/control-personal/asignacion-administrativo`
- `GET /api/v1/control-personal/asignacion-administrativo/{id}`
- `POST /api/v1/control-personal/asignacion-administrativo`
- `PUT /api/v1/control-personal/asignacion-administrativo/{id}`
- `DELETE /api/v1/control-personal/asignacion-administrativo/{id}`
- `GET /api/v1/control-personal/asignacion-administrativo/horario-tipos`

## Estados y validaciones importantes

- acceso permitido solo para `administrador` y `control_personal`
- el cambio inline de horario usa el `PUT` existente y envía `id_horario_tipo`
- los tipos de horario se cargan desde `siacop_horario_tipo`
- la tabla muestra el nombre del horario, no solo el ID
- el formulario principal también usa el catálogo real de horarios
