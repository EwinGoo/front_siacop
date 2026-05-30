import {FormEvent, useEffect, useMemo, useState} from 'react'
import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {KTCard, KTCardBody} from '../../../../../_metronic/helpers'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {useAuth} from '../../../auth'
import {APP_ROLES} from '../../../auth/core/roles'
import {toast} from 'react-toastify'
import {Tooltip} from 'bootstrap'
import {
  actualizarAsignacionAdministrativa,
  crearAsignacionAdministrativa,
  eliminarAsignacionAdministrativa,
  listarHorariosTipo,
  listarAsignacionesAdministrativas,
  obtenerAsignacionAdministrativa,
} from './core/_requests'
import {
  AsignacionAdministrativa,
  HorarioTipo,
  initialAsignacionAdministrativa,
  TipoContratacion,
} from './core/_models'

const breadcrumbs: Array<PageLink> = [
  {
    title: 'Control Personal',
    path: '/apps/asignaciones-administrativas/listar',
    isSeparator: false,
    isActive: false,
  },
]

const tiposContratacion: TipoContratacion[] = [
  'CONVOCATORIA',
  'DESIGNACION',
  'CONTRATO',
  'HONORARIOS',
]

const AsignacionesAdministrativasList = () => {
  const [items, setItems] = useState<AsignacionAdministrativa[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [horariosTipo, setHorariosTipo] = useState<HorarioTipo[]>([])
  const [updatingHorarioId, setUpdatingHorarioId] = useState<number | null>(null)
  const [form, setForm] = useState<AsignacionAdministrativa>(initialAsignacionAdministrativa)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [limit, total])

  const cargarAsignaciones = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await listarAsignacionesAdministrativas(search, page, limit)
      setItems(response.data)
      setTotal(response.pagination.total)
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'No se pudieron cargar las asignaciones.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarAsignaciones()
  }, [page, limit])

  useEffect(() => {
    const cargarHorariosTipo = async () => {
      try {
        const response = await listarHorariosTipo()
        setHorariosTipo(response)
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            'No se pudieron cargar los tipos de horario.'
        )
      }
    }

    void cargarHorariosTipo()
  }, [])

  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  )

  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl)
  })
}, [items])

  const openCreateForm = () => {
    setEditingId(null)
    setForm(initialAsignacionAdministrativa)
    setIsFormOpen(true)
  }

  const openEditForm = async (id: number) => {
    setSaving(true)
    setError(null)

    try {
      const asignacion = await obtenerAsignacionAdministrativa(id)
      setEditingId(id)
      setForm({
        ...initialAsignacionAdministrativa,
        ...asignacion,
        id_persona_administrativo: asignacion.id_persona_administrativo ?? '',
        id_poa: asignacion.id_poa ?? '',
        id_nivel: asignacion.id_nivel ?? '',
        id_horario_tipo: asignacion.id_horario_tipo ?? asignacion.id_tipo_horario ?? '',
        id_tipo_horario: asignacion.id_horario_tipo ?? asignacion.id_tipo_horario ?? '',
        tipo_contratacion: asignacion.tipo_contratacion ?? 'DESIGNACION',
      })
      setIsFormOpen(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'No se pudo abrir la asignación.')
    } finally {
      setSaving(false)
    }
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(initialAsignacionAdministrativa)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      const payload: AsignacionAdministrativa = {
        ...form,
        id_persona_administrativo: Number(form.id_persona_administrativo),
        id_poa: Number(form.id_poa),
        id_nivel: form.id_nivel === '' ? null : Number(form.id_nivel),
        id_horario_tipo:
          (form.id_horario_tipo ?? form.id_tipo_horario) === ''
            ? null
            : Number(form.id_horario_tipo ?? form.id_tipo_horario),
      }

      if (editingId) {
        await actualizarAsignacionAdministrativa(editingId, payload)
        toast.success('Asignación administrativa actualizada correctamente.')
      } else {
        await crearAsignacionAdministrativa(payload)
        toast.success('Asignación administrativa creada correctamente.')
      }

      closeForm()
      await cargarAsignaciones()
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || 'No se pudo guardar la asignación.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    const accepted = window.confirm('¿Deseas eliminar esta asignación administrativa?')
    if (!accepted) {
      return
    }

    try {
      await eliminarAsignacionAdministrativa(id)
      toast.success('Asignación administrativa eliminada correctamente.')

      if (items.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
        return
      }

      await cargarAsignaciones()
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || 'No se pudo eliminar la asignación.'
      )
    }
  }

  const handleHorarioTipoChange = async (item: AsignacionAdministrativa, value: string) => {
    const id = Number(item.id_asignacion_administrativo)
    if (!id) {
      return
    }

    const horarioActual = item.id_horario_tipo ?? item.id_tipo_horario ?? ''
    const horarioNuevo = value === '' ? null : Number(value)

    if ((horarioActual === '' ? null : Number(horarioActual)) === horarioNuevo) {
      return
    }

    setUpdatingHorarioId(id)
    try {
      const actualizado = await actualizarAsignacionAdministrativa(id, {
        id_horario_tipo: horarioNuevo,
      })

      setItems((prev) =>
        prev.map((row) =>
          Number(row.id_asignacion_administrativo) === id
            ? {
                ...row,
                ...actualizado,
                id_horario_tipo: actualizado.id_horario_tipo ?? null,
                id_tipo_horario: actualizado.id_horario_tipo ?? null,
              }
            : row
        )
      )
      toast.success('Tipo de horario actualizado correctamente.')
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || 'No se pudo actualizar el tipo de horario.'
      )
    } finally {
      setUpdatingHorarioId(null)
    }
  }

  const personaNombre = (item: AsignacionAdministrativa) =>
    [item.persona?.nombre, item.persona?.paterno, item.persona?.materno].filter(Boolean).join(' ')

  return (
    <>
      <KTCard className='mb-7'>
        <KTCardBody className='py-6'>
          <div className='d-flex flex-column flex-md-row gap-4 align-items-md-end justify-content-between'>
            <div className='d-flex flex-column flex-md-row gap-3 flex-grow-1'>
              <div className='flex-grow-1'>
                <label className='form-label fw-semibold'>Buscar</label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='CI, nombre, cargo o memorandum'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div>
                <label className='form-label fw-semibold'>Registros</label>
                <select
                  className='form-select'
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value))
                    setPage(1)
                  }}
                >
                  {[10, 20, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='d-flex gap-3'>
              <button
                type='button'
                className='btn btn-light-primary'
                onClick={() => {
                  if (page !== 1) {
                    setPage(1)
                    return
                  }

                  cargarAsignaciones()
                }}
                disabled={loading}
              >
                Buscar
              </button>
              <button type='button' className='btn btn-primary' onClick={openCreateForm}>
                Nueva asignación
              </button>
            </div>
          </div>
        </KTCardBody>
      </KTCard>

      <KTCard>
        <KTCardBody className='py-6'>
          {error && <div className='alert alert-danger'>{error}</div>}

          <div className='table-responsive'>
            <table id='kt_table_hover' className='table align-middle table-row-dashed gy-4' >
              <thead>
                <tr className='text-start text-muted fw-bold fs-7 text-uppercase gs-0'>
                  <th>Persona</th>
                  <th>CI</th>
                  <th>POA</th>
                  <th>Tipo</th>
                  <th>Cargo</th>
                  <th>Inicio</th>
                  <th>Horario</th>
                  <th>Estado</th>
                  <th className='text-end'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className='text-center py-10'>
                      Cargando asignaciones administrativas...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className='text-center py-10'>
                      No se encontraron asignaciones administrativas.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id_asignacion_administrativo}>
                      <td>{personaNombre(item) || 'Sin datos'}</td>
                      <td>{item.persona?.ci || '-'}</td>
                      <td>{item.id_poa}</td>
                      <td>{item.tipo_contratacion || '-'}</td>
                      <td>{item.codigo_cargo || '-'}</td>
                      <td>{item.fecha_inicio_asignacion_administrativo || '-'}</td>
                      <td>
                        {horariosTipo.find(
                          (horario) =>
                            horario.id_horario_tipo ===
                            Number(item.id_horario_tipo ?? item.id_tipo_horario ?? 0)
                        )?.nombre_horario_tipo || '-'}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.estado_asignacion_administrativo
                              ? 'badge-light-success'
                              : 'badge-light-danger'
                          }`}
                        >
                          {item.estado_asignacion_administrativo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className='text-end' style={{whiteSpace: 'nowrap'}}>
                        <div className='d-flex justify-content-end gap-2 align-items-center flex-nowrap'>
                          <select
                            className='form-select form-select-sm'
                            style={{width: '180px'}}
                            value={String(item.id_horario_tipo ?? item.id_tipo_horario ?? '')}
                            onChange={(event) =>
                              void handleHorarioTipoChange(item, event.target.value)
                            }
                            disabled={
                              saving ||
                              updatingHorarioId === Number(item.id_asignacion_administrativo)
                            }
                          >
                            <option value=''>Sin horario</option>
                            {horariosTipo.map((horario) => (
                              <option key={horario.id_horario_tipo} value={horario.id_horario_tipo}>
                                {horario.nombre_horario_tipo}
                              </option>
                            ))}
                          </select>

                          <button
                            type='button'
                            className='btn btn-icon btn-light-primary btn-sm'
                            onClick={() => openEditForm(Number(item.id_asignacion_administrativo))}
                            disabled={saving}
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Editar asignación'
                          >
                            <i className='ki-duotone ki-pencil fs-4'>
                              <span className='path1'></span>
                              <span className='path2'></span>
                            </i>
                          </button>

                          <button
                            type='button'
                            className='btn btn-icon btn-light-danger btn-sm'
                            onClick={() => handleDelete(Number(item.id_asignacion_administrativo))}
                            disabled={saving}
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='Eliminar asignación'
                          >
                            <i className='ki-duotone ki-trash fs-4'>
                              <span className='path1'></span>
                              <span className='path2'></span>
                              <span className='path3'></span>
                            </i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 pt-4'>
            <div className='text-muted fs-7'>Total: {total} registro(s)</div>
            <div className='d-flex align-items-center gap-3'>
              <button
                type='button'
                className='btn btn-sm btn-light'
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || loading}
              >
                Anterior
              </button>
              <span className='text-muted fs-7'>
                Página {page} de {totalPages}
              </span>
              <button
                type='button'
                className='btn btn-sm btn-light'
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || loading}
              >
                Siguiente
              </button>
            </div>
          </div>
        </KTCardBody>
      </KTCard>

      {isFormOpen && (
        <div
          className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
          style={{backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 1050, padding: '1rem'}}
        >
          <div
            className='card w-100'
            style={{maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto'}}
          >
            <div className='card-header d-flex justify-content-between align-items-center'>
              <h3 className='card-title m-0'>
                {editingId ? 'Editar asignación administrativa' : 'Nueva asignación administrativa'}
              </h3>
              <button type='button' className='btn btn-sm btn-light' onClick={closeForm}>
                Cerrar
              </button>
            </div>
            <div className='card-body'>
              <form onSubmit={handleSubmit}>
                <div className='row g-5'>
                  <div className='col-md-6'>
                    <label className='form-label required'>ID Persona</label>
                    <input
                      type='number'
                      className='form-control'
                      value={form.id_persona_administrativo}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          id_persona_administrativo:
                            event.target.value === '' ? '' : Number(event.target.value),
                        }))
                      }
                      min={1}
                      required
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label required'>ID POA</label>
                    <input
                      type='number'
                      className='form-control'
                      value={form.id_poa}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          id_poa: event.target.value === '' ? '' : Number(event.target.value),
                        }))
                      }
                      min={1}
                      required
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>ID Nivel</label>
                    <input
                      type='number'
                      className='form-control'
                      value={form.id_nivel ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          id_nivel: event.target.value === '' ? '' : Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Tipo Horario</label>
                    <select
                      className='form-select'
                      value={String(form.id_horario_tipo ?? form.id_tipo_horario ?? '')}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          id_horario_tipo:
                            event.target.value === '' ? '' : Number(event.target.value),
                          id_tipo_horario:
                            event.target.value === '' ? '' : Number(event.target.value),
                        }))
                      }
                    >
                      <option value=''>Sin horario</option>
                      {horariosTipo.map((horario) => (
                        <option key={horario.id_horario_tipo} value={horario.id_horario_tipo}>
                          {horario.nombre_horario_tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Tipo de contratación</label>
                    <select
                      className='form-select'
                      value={form.tipo_contratacion ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          tipo_contratacion: event.target.value as TipoContratacion,
                        }))
                      }
                    >
                      {tiposContratacion.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Código cargo</label>
                    <input
                      type='text'
                      className='form-control'
                      value={form.codigo_cargo ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({...prev, codigo_cargo: event.target.value}))
                      }
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>Número memorandum</label>
                    <input
                      type='text'
                      className='form-control'
                      value={form.numero_memorandum ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({...prev, numero_memorandum: event.target.value}))
                      }
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label'>URL memorandum</label>
                    <input
                      type='url'
                      className='form-control'
                      value={form.url_memorandum ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({...prev, url_memorandum: event.target.value}))
                      }
                    />
                  </div>
                  <div className='col-md-4'>
                    <label className='form-label'>Fecha inicio</label>
                    <input
                      type='date'
                      className='form-control'
                      value={form.fecha_inicio_asignacion_administrativo ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          fecha_inicio_asignacion_administrativo: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className='col-md-4'>
                    <label className='form-label'>Fecha fin</label>
                    <input
                      type='date'
                      className='form-control'
                      value={form.fecha_fin_asignacion_administrativo ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          fecha_fin_asignacion_administrativo: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className='col-md-4'>
                    <label className='form-label'>Fecha memorandum</label>
                    <input
                      type='date'
                      className='form-control'
                      value={form.fecha_creacion_memorandum ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          fecha_creacion_memorandum: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label'>Detalle finalización</label>
                    <textarea
                      className='form-control'
                      rows={3}
                      value={form.detalle_finalizacion_asignacion ?? ''}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          detalle_finalizacion_asignacion: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-check form-switch form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={Boolean(form.estado_asignacion_administrativo)}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            estado_asignacion_administrativo: event.target.checked,
                          }))
                        }
                      />
                      <span className='form-check-label fw-semibold text-gray-700 ms-3'>
                        Asignación activa
                      </span>
                    </label>
                  </div>
                </div>

                <div className='d-flex justify-content-end gap-3 mt-8'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancelar
                  </button>
                  <button type='submit' className='btn btn-primary' disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const AsignacionesAdministrativasPage = () => {
  const {currentUser} = useAuth()
  const canAccess = Boolean(
    currentUser?.groups?.includes(APP_ROLES.ADMINISTRADOR) ||
      currentUser?.groups?.includes(APP_ROLES.CONTROL_PERSONAL)
  )

  if (!canAccess) {
    return <Navigate to='/acceso-denegado' replace />
  }

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='/listar'
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Asignaciones Administrativas</PageTitle>
              <AsignacionesAdministrativasList />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/asignaciones-administrativas/listar' replace />} />
    </Routes>
  )
}

export default AsignacionesAdministrativasPage
