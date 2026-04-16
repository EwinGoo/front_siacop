import {useEffect, useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import {useListView} from '../core/ListViewProvider'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {createGrupo, updateGrupo, getGrupoById, agregarMiembro, eliminarMiembro, actualizarMiembro} from '../core/_requests'
import {Grupo, GrupoMiembro, initialGrupo} from '../core/_models'
import {KTIcon} from '../../../../../../../../_metronic/helpers'
import {getBloquesDropdown} from '../../../bloques/bloque-list/core/_requests'
import {Bloque} from '../../../bloques/bloque-list/core/_models'
import axios from 'axios'
import {API_ROUTES} from 'src/app/config/apiRoutes'

const schema = Yup.object({
  nombre: Yup.string().min(2).max(100).required('El nombre es obligatorio'),
  descripcion: Yup.string().max(255).nullable(),
  orden: Yup.number().min(1).required('El orden es obligatorio'),
})

const EditModal = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const [loading, setLoading] = useState(false)
  const [grupo, setGrupo] = useState<Grupo>(initialGrupo)
  const [bloques, setBloques] = useState<Bloque[]>([])
  // Para buscar guardias
  const [searchPersona, setSearchPersona] = useState('')
  const [personasEncontradas, setPersonasEncontradas] = useState<any[]>([])
  const [buscando, setBuscando] = useState(false)
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | null>(null)

  useEffect(() => {
    getBloquesDropdown().then(setBloques)
  }, [])

  useEffect(() => {
    if (itemIdForUpdate && itemIdForUpdate !== null) {
      getGrupoById(itemIdForUpdate).then((data) => {
        if (data) setGrupo(data)
      })
    } else {
      setGrupo(initialGrupo)
    }
  }, [itemIdForUpdate])

  const formik = useFormik({
    initialValues: grupo,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        let updated: Grupo | undefined
        if (values.id_grupo) {
          updated = await updateGrupo(values)
        } else {
          updated = await createGrupo(values)
        }
        if (updated) setGrupo(updated)
        await Swal.fire({icon: 'success', title: values.id_grupo ? 'Grupo actualizado' : 'Grupo creado', timer: 1500, showConfirmButton: false})
        refetch()
        if (!values.id_grupo) setItemIdForUpdate(undefined)
      } catch {
        Swal.fire({icon: 'error', title: 'Error', text: 'No se pudo guardar el grupo'})
      } finally {
        setLoading(false)
      }
    },
  })

  // Buscar persona para agregar al grupo
  useEffect(() => {
    if (!searchPersona || searchPersona.length < 3) {
      setPersonasEncontradas([])
      return
    }
    const timer = setTimeout(async () => {
      setBuscando(true)
      try {
        const res = await axios.get(`${API_ROUTES.CONTROL_PERSONAL.replace('/control-personal', '')}/api/persona/autocompletar?q=${searchPersona}`)
        setPersonasEncontradas(res.data?.data || [])
      } catch {
        setPersonasEncontradas([])
      } finally {
        setBuscando(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchPersona])

  const handleAgregarMiembro = async (persona: any) => {
    if (!grupo.id_grupo) return
    try {
      const updated = await agregarMiembro(grupo.id_grupo as number, persona.id, bloqueSeleccionado)
      if (updated) setGrupo(updated)
      setSearchPersona('')
      setPersonasEncontradas([])
      refetch()
    } catch (e: any) {
      Swal.fire({icon: 'error', title: 'Error', text: e?.response?.data?.message || 'No se pudo agregar el miembro'})
    }
  }

  const handleEliminarMiembro = async (miembro: GrupoMiembro) => {
    if (!grupo.id_grupo) return
    const result = await Swal.fire({
      title: '¿Quitar guardia del grupo?',
      text: `${miembro.paterno} ${miembro.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f1416c',
    })
    if (result.isConfirmed) {
      const updated = await eliminarMiembro(grupo.id_grupo as number, miembro.id_grupo_miembro as number)
      const refreshed = await getGrupoById(grupo.id_grupo)
      if (refreshed) setGrupo(refreshed)
      refetch()
    }
  }

  const handleCambiarBloqueMiembro = async (miembro: GrupoMiembro, idBloque: number | null) => {
    if (!grupo.id_grupo) return
    const updated = await actualizarMiembro(grupo.id_grupo as number, miembro.id_grupo_miembro as number, idBloque)
    const refreshed = await getGrupoById(grupo.id_grupo)
    if (refreshed) setGrupo(refreshed)
    refetch()
  }

  const isEdit = !!grupo.id_grupo

  return (
    <>
      <div className='modal fade show d-block' tabIndex={-1} role='dialog'>
        <div className='modal-dialog modal-dialog-centered mw-750px'>
          <div className='modal-content'>
            {/* Header */}
            <div className='modal-header bg-primary'>
              <h2 className='fw-bolder text-white'>
                {isEdit ? `Grupo: ${grupo.nombre}` : 'Nuevo Grupo de Guardias'}
              </h2>
              <button className='btn btn-icon btn-sm btn-light-danger ms-2' onClick={() => setItemIdForUpdate(undefined)}>
                <KTIcon iconName='cross' className='fs-1' />
              </button>
            </div>

            <div className='modal-body scroll-y mx-5 my-7' style={{maxHeight: '75vh', overflowY: 'auto'}}>
              {/* Formulario básico */}
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className='row mb-5'>
                  <div className='col-md-8'>
                    <label className='required fw-bold fs-6 mb-2'>Nombre del Grupo</label>
                    <input
                      type='text'
                      className={`form-control form-control-solid ${formik.touched.nombre && formik.errors.nombre ? 'is-invalid' : ''}`}
                      placeholder='Ej: Grupo A'
                      {...formik.getFieldProps('nombre')}
                    />
                    {formik.touched.nombre && formik.errors.nombre && (
                      <div className='text-danger fs-7'>{formik.errors.nombre}</div>
                    )}
                  </div>
                  <div className='col-md-4'>
                    <label className='required fw-bold fs-6 mb-2'>Orden rotación</label>
                    <input
                      type='number'
                      min={1}
                      className='form-control form-control-solid'
                      {...formik.getFieldProps('orden')}
                    />
                  </div>
                </div>
                <div className='mb-5'>
                  <label className='fw-bold fs-6 mb-2'>Descripción</label>
                  <textarea
                    className='form-control form-control-solid'
                    rows={2}
                    placeholder='Descripción opcional...'
                    {...formik.getFieldProps('descripcion')}
                  />
                </div>
                <div className='text-end mb-7'>
                  <button type='button' className='btn btn-light me-3' onClick={() => setItemIdForUpdate(undefined)}>
                    {isEdit ? 'Cerrar' : 'Cancelar'}
                  </button>
                  <button type='submit' className='btn btn-primary' disabled={loading || !formik.isValid}>
                    {loading ? (
                      <span className='indicator-progress d-block'>
                        Guardando... <span className='spinner-border spinner-border-sm ms-2'></span>
                      </span>
                    ) : isEdit ? 'Actualizar Grupo' : 'Crear Grupo'}
                  </button>
                </div>
              </form>

              {/* Gestión de miembros (solo si el grupo ya existe) */}
              {isEdit && (
                <>
                  <div className='separator separator-dashed my-5'></div>
                  <h4 className='fw-bolder mb-5'>
                    <KTIcon iconName='people' className='fs-2 me-2' />
                    Guardias del Grupo
                    <span className='badge badge-light-primary ms-2'>{grupo.miembros?.length || 0}</span>
                  </h4>

                  {/* Buscar guardia para agregar */}
                  <div className='card card-bordered p-4 mb-5 bg-light'>
                    <div className='fw-bold text-muted mb-3 fs-7'>AGREGAR GUARDIA AL GRUPO</div>
                    <div className='row g-3'>
                      <div className='col-md-5'>
                        <div className='position-relative'>
                          {/* <KTIcon iconName='magnifier' className='fs-3 position-absolute' style={{top: '10px', left: '12px'}} /> */}
                          <KTIcon iconName='magnifier' className='fs-3 position-absolute'/>
                          <input
                            type='text'
                            className='form-control form-control-sm ps-12'
                            placeholder='Buscar por nombre o CI...'
                            value={searchPersona}
                            onChange={(e) => setSearchPersona(e.target.value)}
                          />
                          {buscando && (
                            <span className='spinner-border spinner-border-sm position-absolute' style={{top: '10px', right: '12px'}}></span>
                          )}
                        </div>
                        {/* Resultados autocomplete */}
                        {personasEncontradas.length > 0 && (
                          <div className='card shadow-sm position-absolute z-index-3 w-100 mt-1' style={{zIndex: 1000}}>
                            <div className='card-body p-2'>
                              {personasEncontradas.map((p) => (
                                <div
                                  key={p.id}
                                  className='d-flex align-items-center p-2 rounded hover-bg-light cursor-pointer'
                                  onClick={() => handleAgregarMiembro(p)}
                                  style={{cursor: 'pointer'}}
                                >
                                  <div className='symbol symbol-30px me-3'>
                                    <span className='symbol-label bg-primary text-white fs-8 fw-bold'>
                                      {p.nombre?.charAt(0)}{p.paterno?.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className='fw-bold fs-7'>{p.paterno} {p.materno} {p.nombre}</div>
                                    <div className='text-muted fs-8'>CI: {p.ci}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='col-md-5'>
                        <select
                          className='form-select form-select-sm'
                          value={bloqueSeleccionado ?? ''}
                          onChange={(e) => setBloqueSeleccionado(e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value=''>Sin bloque por defecto</option>
                          {bloques.map((b) => (
                            <option key={b.id_bloque as number} value={b.id_bloque as number}>{b.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de miembros */}
                  <div className='table-responsive'>
                    <table className='table table-row-bordered table-row-gray-100 gy-3'>
                      <thead className='text-uppercase text-muted fw-bolder fs-8'>
                        <tr>
                          <th>Guardia</th>
                          <th>CI</th>
                          <th>Bloque por defecto</th>
                          <th className='text-end'>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!grupo.miembros?.length ? (
                          <tr><td colSpan={4} className='text-center text-muted py-5'>Sin guardias asignados</td></tr>
                        ) : grupo.miembros.map((m) => (
                          <tr key={m.id_grupo_miembro}>
                            <td>
                              <div className='d-flex align-items-center'>
                                <div className='symbol symbol-35px me-3'>
                                  <span className='symbol-label bg-light-primary text-primary fw-bold fs-7'>
                                    {m.nombre?.charAt(0)}{m.paterno?.charAt(0)}
                                  </span>
                                </div>
                                <span className='fw-bold'>{m.paterno} {m.materno} {m.nombre}</span>
                              </div>
                            </td>
                            <td className='text-muted'>{m.ci}</td>
                            <td>
                              <select
                                className='form-select form-select-sm w-150px'
                                value={m.id_bloque ?? ''}
                                onChange={(e) => handleCambiarBloqueMiembro(m, e.target.value ? Number(e.target.value) : null)}
                              >
                                <option value=''>Sin bloque</option>
                                {bloques.map((b) => (
                                  <option key={b.id_bloque as number} value={b.id_bloque as number}>{b.nombre}</option>
                                ))}
                              </select>
                            </td>
                            <td className='text-end'>
                              <button
                                className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm'
                                title='Quitar del grupo'
                                onClick={() => handleEliminarMiembro(m)}
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  )
}

export {EditModal}
