# MANUAL DE USUARIO DEL SISTEMA SIACOP V3

## Índice

1. Presentación
2. Objetivo del manual
3. Alcance del sistema
4. Requisitos básicos de uso
5. Acceso al sistema
6. Navegación general
7. Módulos principales
8. Módulo de permisos
9. Módulo de comisiones
10. Módulo de declaratoria en comisión
11. Módulo de vacaciones
12. Módulo de asignaciones administrativas
13. Módulo de gestión QR
14. Módulo de guardias de seguridad
15. Módulo de planilla de asistencia
16. Módulo de bono refrigerio
17. Reportes y consultas
18. Mensajes comunes del sistema
19. Buenas prácticas de uso
20. Soporte y observaciones finales

## 1. Presentación

El presente manual de usuario describe el funcionamiento general de la versión 3 del Sistema de Administración y Control de Planillas `SIACOP V3`, desarrollado para apoyar los procesos de control de personal, gestión administrativa y generación de planillas dentro de la Unidad de Recursos Humanos.

El sistema fue concebido como una solución web híbrida, moderna y modular, capaz de convivir con la versión anterior del sistema y al mismo tiempo incorporar nuevos procesos, nuevas vistas de usuario y nuevos mecanismos de integración institucional.

**Captura sugerida**

- Pantalla principal del sistema o dashboard inicial luego del acceso.

## 2. Objetivo del manual

El objetivo de este manual es orientar al usuario en el uso de las funcionalidades principales del sistema, explicando de forma práctica cómo acceder, navegar y utilizar los módulos más importantes de SIACOP V3.

Este documento está dirigido principalmente a:

- personal administrativo de Recursos Humanos
- planilleros
- secretarias del área
- encargados operativos de control personal
- usuarios con acceso a módulos de consulta y gestión

**Captura sugerida**

- Menú lateral completo con los módulos visibles para un usuario administrativo.

## 3. Alcance del sistema

SIACOP V3 permite gestionar procesos vinculados al control personal y al tratamiento de información administrativa relacionada con asistencia y planillas.

Entre sus funciones principales se encuentran:

- gestión de permisos
- gestión de comisiones
- declaratorias en comisión
- gestión de vacaciones
- asignaciones administrativas
- gestión QR de documentos
- programación de guardias
- importación de marcaciones biométricas
- generación de planilla de asistencia
- consolidación de bono refrigerio
- emisión de reportes y documentos PDF

**Captura sugerida**

- Vista general del menú o panel donde se observen los módulos principales.

## 4. Requisitos básicos de uso

Para utilizar el sistema se recomienda contar con:

- acceso autorizado al sistema institucional
- navegador web actualizado
- conexión estable a la red institucional o al entorno donde esté desplegado el sistema
- permisos asignados según el rol del usuario

Navegadores recomendados:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

También se recomienda el uso en:

- computadoras de escritorio para tareas operativas extensas
- dispositivos móviles para revisión rápida o consulta puntual

**Captura sugerida**

- No es obligatoria. Puede omitirse o colocarse una imagen de acceso desde navegador.

## 5. Acceso al sistema

El acceso al sistema se realiza a través del entorno institucional. SIACOP V3 utiliza autenticación compartida con la plataforma principal, por lo que no requiere un mecanismo independiente de inicio de sesión dentro de la SPA React.

Flujo general de acceso:

1. El usuario inicia sesión en el sistema institucional.
2. El backend valida la sesión activa.
3. La interfaz React reutiliza dicha sesión compartida.
4. El sistema habilita el acceso a los módulos según el rol y permisos del usuario.

En caso de expiración de sesión, el sistema restringe el acceso a rutas privadas y solicita nuevamente autenticación desde el entorno principal.

**Captura sugerida**

- Pantalla de inicio de sesión institucional.
- Pantalla de acceso exitoso al entorno `/apps`.

## 6. Navegación general

La navegación del sistema está organizada mediante un menú lateral y vistas principales por módulo. El usuario puede desplazarse entre las distintas opciones según los permisos otorgados.

Elementos comunes de navegación:

- menú lateral de módulos
- encabezados de página
- buscadores
- filtros
- tablas en escritorio
- tarjetas en móvil
- modales para ver, editar o imprimir información

La experiencia de usuario está adaptada para:

- escritorio, donde predominan tablas comparativas
- móvil, donde predominan tarjetas y acciones compactas

**Captura sugerida**

- Menú lateral abierto.
- Una pantalla en escritorio con tabla.
- La misma o similar pantalla en vista móvil con cards.

## 7. Módulos principales

El sistema se organiza en módulos funcionales que responden a procesos específicos del área de Recursos Humanos. Cada módulo posee sus propias acciones, formularios, estados y reportes.

Los módulos más importantes son:

- permisos
- comisiones
- declaratoria en comisión
- vacaciones
- asignaciones administrativas
- gestión QR
- guardias de seguridad
- planilla de asistencia
- bono refrigerio

**Captura sugerida**

- Vista del menú con todos los módulos principales visibles.

## 8. Módulo de permisos

El módulo de permisos permite registrar, revisar y gestionar justificativos administrativos asociados a ausencias o permisos parciales del personal.

Acciones principales:

- crear permiso
- editar permiso
- aprobar permiso
- observar permiso
- filtrar permisos
- generar reportes

Flujo básico:

1. Ingresar al módulo de permisos.
2. Registrar la información del solicitante.
3. Definir el tipo de permiso y su cobertura.
4. Guardar el registro.
5. Aprobar u observar según corresponda.

El módulo contempla permisos:

- de día completo
- por turno
- por cobertura parcial

**Capturas sugeridas**

- Pantalla principal del listado de permisos.
- Formulario de registro o edición de permiso.
- Modal o acción de aprobación.
- Reporte PDF o vista previa del reporte.

## 9. Módulo de comisiones

El módulo de comisiones permite gestionar boletas de comisión y controlar su flujo documental desde la generación hasta la aprobación y emisión del reporte.

Acciones principales:

- crear comisión
- editar comisión
- enviar comisión
- recepcionar comisión
- aprobar comisión
- observar comisión
- imprimir boleta
- generar reporte general

El sistema permite además:

- filtrar por estado
- buscar por solicitante o código
- visualizar el PDF dentro del sistema

**Capturas sugeridas**

- Listado de comisiones con filtro por estado.
- Formulario de creación o edición.
- Modal de observación.
- Vista previa del PDF de la boleta.
- Reporte general en PDF.

## 10. Módulo de declaratoria en comisión

Este módulo permite registrar declaratorias institucionales en comisión y generar su documento correspondiente.

Acciones principales:

- registrar declaratoria
- editar declaratoria
- consultar detalle
- anular declaratoria
- visualizar PDF

El documento puede visualizarse dentro del sistema mediante modal, facilitando la revisión sin salir de la plataforma.

**Capturas sugeridas**

- Listado de declaratorias.
- Formulario de registro.
- Vista de datos o detalle.
- Vista del PDF en modal.

## 11. Módulo de vacaciones

El módulo de vacaciones permite consultar y reportar información relacionada con solicitudes de vacaciones aprobadas.

Acciones principales:

- consultar vacaciones
- filtrar por fecha y estado
- generar reporte general
- generar reporte de recepción

El sistema adapta la visualización del PDF según el dispositivo:

- en escritorio, se muestra dentro de un modal
- en móvil, se prioriza la descarga del archivo

**Capturas sugeridas**

- Listado de vacaciones.
- Modal de filtros de reporte.
- Vista previa o descarga del PDF.

## 12. Módulo de asignaciones administrativas

Este módulo permite revisar la relación administrativa activa entre persona, cargo, unidad, contrato y tipo de horario.

Acciones principales:

- listar asignaciones
- buscar por persona
- consultar detalle
- registrar o actualizar información administrativa según permisos

Este módulo es importante porque alimenta otros procesos del sistema, especialmente:

- permisos
- comisiones
- guardias
- planilla de asistencia

**Capturas sugeridas**

- Listado de asignaciones administrativas.
- Vista de detalle o formulario de edición.

## 13. Módulo de gestión QR

El módulo de gestión QR permite procesar documentos administrativos mediante lectura de códigos QR o ingreso manual de identificadores.

Documentos manejados:

- comisiones
- permisos
- vacaciones

Funciones principales:

- escaneo por cámara
- lectura automática
- ingreso manual de código
- recepción
- aprobación
- observación

El sistema detecta automáticamente el tipo documental según el código leído y redirige la acción al flujo correspondiente.

**Capturas sugeridas**

- Pantalla principal del módulo QR.
- Vista de escaneo activo.
- Modal de procesamiento de documento.

## 14. Módulo de guardias de seguridad

El módulo de guardias permite gestionar la organización operativa del personal de seguridad.

Funciones principales:

- registrar bloques o áreas
- registrar grupos
- asignar miembros
- configurar rotación
- generar programación semanal
- realizar asignaciones manuales
- registrar reemplazos

La programación puede visualizarse en:

- formato tabla
- formato calendario

Este módulo se integra con planilla de asistencia, ya que el turno real de guardia influye directamente en el cálculo diario.

**Capturas sugeridas**

- Pantalla principal de guardias.
- Gestión de bloques o grupos.
- Pantalla de horario semanal.
- Vista de asignación o reemplazo.

## 15. Módulo de planilla de asistencia

El módulo de planilla de asistencia constituye el núcleo operativo del sistema. Su finalidad es importar marcaciones, procesarlas y generar resultados diarios y mensuales por persona.

Áreas funcionales principales:

- importación de marcaciones
- procesos de planilla
- resultados diarios
- resultados mensuales

### 15.1. Importación de marcaciones

Permite cargar archivos biométricos de marcación y dejar trazabilidad del archivo origen.

Acciones:

- subir archivo `.dat`
- revisar marcaciones crudas
- revisar marcaciones normalizadas
- consultar resumen por archivo

**Capturas sugeridas**

- Pantalla de importación de marcaciones.
- Vista de resumen de importación.
- Vista de marcaciones normalizadas.

### 15.2. Procesos mensuales

Permite crear procesos de cálculo por rango de fechas y ejecutarlos sobre un universo controlado de personas.

Acciones:

- crear proceso
- consultar proceso
- ejecutar proceso
- revisar estado y resumen

**Capturas sugeridas**

- Pantalla de listado de procesos.
- Modal o formulario de creación de proceso.
- Estado de proceso ejecutado.

### 15.3. Resultados diarios

Permite revisar el estado diario de asistencia por persona y fecha.

Información visible:

- estado diario
- justificativo principal
- horario aplicado
- marcaciones válidas
- observaciones

**Capturas sugeridas**

- Pantalla de resultados diarios.
- Detalle diario de una persona.

### 15.4. Resultados mensuales

Permite revisar el consolidado final de asistencia por persona.

Información visible:

- atrasos
- faltas
- abandonos
- descuentos
- estado mensual

**Capturas sugeridas**

- Pantalla de resultados mensuales.
- Detalle mensual por persona.

## 16. Módulo de bono refrigerio

El módulo de bono refrigerio utiliza como base los resultados diarios de asistencia para clasificar los días pagables y no pagables del beneficio.

Funciones principales:

- seleccionar proceso mensual
- listar consolidado de bono
- consultar detalle por persona
- generar reporte PDF

El sistema clasifica días como:

- válidos
- excluidos
- no válidos
- observados

**Capturas sugeridas**

- Pantalla principal del bono refrigerio.
- Detalle diario por persona.
- Reporte PDF de bono refrigerio.

## 17. Reportes y consultas

El sistema cuenta con una capa transversal de consultas y reportes, lo que permite al usuario revisar información filtrada y generar documentos institucionales en formato PDF.

Entre los reportes más importantes se encuentran:

- boleta de comisión
- declaratoria en comisión
- reporte de permisos
- reporte de vacaciones
- reporte de planilla de asistencia
- reporte de bono refrigerio

Los documentos pueden:

- visualizarse dentro del sistema
- descargarse
- imprimirse

**Capturas sugeridas**

- Un ejemplo de reporte PDF en modal.
- Un ejemplo de listado con filtros y buscador.

## 18. Mensajes comunes del sistema

Durante la operación del sistema pueden aparecer mensajes de:

- registro exitoso
- actualización correcta
- aprobación realizada
- observación registrada
- acceso restringido
- sesión expirada
- error de validación
- error de integración

Se recomienda al usuario:

- leer cuidadosamente cada mensaje
- verificar los datos ingresados
- repetir la operación solo si corresponde
- reportar incidencias persistentes al área técnica

**Capturas sugeridas**

- Mensaje de éxito.
- Mensaje de validación.
- Mensaje de error o acceso restringido.

## 19. Buenas prácticas de uso

Para un uso adecuado del sistema se recomienda:

- verificar la información antes de guardar
- no duplicar registros innecesariamente
- revisar estados documentales antes de aprobar
- utilizar filtros para mejorar la búsqueda
- cerrar sesión cuando termine la jornada
- revisar periódicamente procesos y resultados antes de emitir reportes finales

En planilla de asistencia, se recomienda especialmente:

- validar importaciones antes de ejecutar el proceso
- confirmar justificativos aprobados
- revisar casos observados antes del cierre mensual

**Captura sugerida**

- No obligatoria. Puede omitirse o colocarse una imagen de cierre de sesión o revisión final.

## 20. Soporte y observaciones finales

SIACOP V3 fue diseñado para optimizar la operación administrativa del área de Recursos Humanos, reducir la carga manual y mejorar la trazabilidad de procesos relacionados con control personal, asistencia y planillas.

Ante problemas de uso o incidencias operativas, se recomienda:

- contactar al responsable técnico del sistema
- registrar el módulo afectado
- describir el problema observado
- adjuntar captura de pantalla cuando sea posible

Este manual puede actualizarse conforme el sistema incorpore nuevos módulos, mejoras funcionales o ampliaciones institucionales.

**Captura sugerida**

- Pantalla final del sistema o una vista general del menú como cierre del manual.
