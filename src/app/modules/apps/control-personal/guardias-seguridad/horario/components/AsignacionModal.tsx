import {useEffect, useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import axios from 'axios'
import {KTIcon} from 'src/_metronic/helpers'
import {API_ROUTES} from 'src/app/config/apiRoutes'
import {TurnoInfo, AsignacionDia, GrupoInfo} from '../core/_models'
import {getBloquesDropdown} from '../../bloques/bloque-list/core/_requests'
import {Bloque} from '../../bloques/bloque-list/core/_models'

type Props = {
  fecha: string
  asignacion?: AsignacionDia
  turnos: TurnoInfo[]
  grupos: GrupoInfo[]
  onClose: () => void
  onSaved: () => void
}

const schema = Yup.object({
  id_persona: Yup.number().required('Seleccione un guardia').moreThan(0, 'Seleccione un guardia'),
  id_turno: Yup.number().required('Seleccione un turno').moreThan(0, 'Seleccione un turno'),
  id_bloque: Yup.number().nullable(),
  tipo_origen: Yup.string().oneOf(['MANUAL', 'EMERGENCIA']).required(),
  observacion: Yup.string().max(500).nullable(),
})

const AsignacionModal = ({fecha, asignacion, turnos, grupos, onClose, onSaved}: Props) => {
  const [loading, setLoading] = useState(false)
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [searchPersona, setSearchPersona] = useState(
    asignacion ? `${asignacion.paterno} ${asignacion.nombre_persona} - CI: ${asignacion.ci}` : ''
  )
  const [personasEncontradas, setPersonasEncontradas] = useState<any[]>([])
  const [buscando, setBuscando] = useState(false)
  const [personaSeleccionada, setPersonaSeleccionada] = useState<any | null>(
    asignacion ? {id: asignacion.id_persona, nombre: asignacion.nombre_persona, ci: asignacion.ci} : null
  )

  const esEdicion = !!asignacion?.id_asignacion
  const BASE_ASIG = `${API_ROUTES.GUARDIAS}/asignaciones`

  useEffect(() => {
    getBloquesDropdown().then(setBloques)
  }, [])

  // Determinar tipo_origen automático
  const fechaObj = new Date(fecha + 'T12:00:00')
  const diaSemana = fechaObj.getDay()
  const esFinDeSemana = diaSemana === 0 || diaSemana === 6
  const tipoOrigenDefault = esFinDeSemana ? 'MANUAL' : 'EMERGENCIA'

  const formik = useFormik({
    initialValues: {
      id_persona: asignacion?.id_persona || 0,
      id_turno: asignacion?.id_turno || (turnos[0]?.id_turno || 0),
      id_bloque: asignacion?.id_bloque || null,
      id_grupo: asignacion?.id_grupo || null,
      tipo_origen: asignacion?.tipo_origen || tipoOrigenDefault,
      observacion: asignacion?.observacion || '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const payload = {...values, fecha}
        if (esEdicion) {
          await axios.put(`${BASE_ASIG}/${asignacion!.id_asignacion}`, payload)
        } else {
          await axios.post(BASE_ASIG, payload)
        }
        await Swal.fire({
          icon: 'success',
          title: esEdicion ? 'Asignación actualizada' : 'Guardia asignado',
          timer: 1500,
          showConfirmButton: false,
        })
        onSaved()
      } catch (e: any) {
        Swal.fire({icon: 'error', title: 'Error', text: e?.response?.data?.message || 'No se pudo guardar'})
      } finally {
        setLoading(false)
      }
    },
  })

  // Autocomplete persona
  useEffect(() => {
    if (personaSeleccionada || !searchPersona || searchPersona.length < 3) {
      setPersonasEncontradas([])
      return
    }
    const timer = setTimeout(async () => {
      setBuscando(true)
      try {
        const res = await axios.get(`${API_ROUTES.CONTROL_PERSONAL.replace('/control-personal', '')}/persona/autocompletar?termino=${searchPersona}`)
        setPersonasEncontradas(res.data?.data || [])
      } catch {
        setPersonasEncontradas([])
      } finally {
        setBuscando(false)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchPersona, personaSeleccionada])

  const handleSelectPersona = (p: any) => {
    setPersonaSeleccionada(p)
    setSearchPersona(`${p.paterno} ${p.nombre} — CI: ${p.ci}`)
    setPersonasEncontradas([])
    formik.setFieldValue('id_persona', p.id)
  }

  const handleDeleteAsignacion = async () => {
    if (!esEdicion) return
    const result = await Swal.fire({
      title: '¿Quitar asignación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f1416c',
    })
    if (result.isConfirmed) {
      await axios.delete(`${BASE_ASIG}/${asignacion!.id_asignacion}`)
      onSaved()
    }
  }

  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <div className='modal fade show d-block' tabIndex={-1}>
        <div className='modal-dialog modal-dialog-centered mw-550px'>
          <div className='modal-content'>
            <div className={`modal-header ${esFinDeSemana ? 'bg-warning' : 'bg-danger'}`}>
              <h2 className='fw-bolder text-white text-capitalize'>
                <KTIcon iconName='calendar-add' className='fs-2 me-2 text-white' />
                {esEdicion ? 'Editar' : esFinDeSemana ? 'Asignar guardia' : 'Cambio de emergencia'}
              </h2>
              <button className='btn btn-icon btn-sm btn-light-danger ms-2' onClick={onClose}>
                <KTIcon iconName='cross' className='fs-1' />
              </button>
            </div>
            <div className='modal-body mx-5 my-6'>
              {/* Fecha */}
              <div className='d-flex align-items-center bg-light rounded p-3 mb-5'>
                <KTIcon iconName='calendar' className='fs-2 text-primary me-3' />
                <div>
                  <div className='fw-bolder text-dark text-capitalize'>{fechaFormateada}</div>
                  <span className={`badge ${esFinDeSemana ? 'badge-light-warning' : 'badge-light-danger'}`}>
                    {esFinDeSemana ? 'Fin de semana — Asignación manual' : 'Día laborable — Emergencia'}
                  </span>
                </div>
              </div>

              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Buscar guardia */}
                <div className='fv-row mb-5'>
                  <label className='required fw-bold fs-6 mb-2'>Guardia</label>
                  <div className='position-relative'>
                    {/* <KTIcon iconName='magnifier' className='fs-3 position-absolute' style={{top: '10px', left: '12px'}} /> */}
                    <KTIcon iconName='magnifier' className='fs-3 position-absolute' />
                    <input
                      type='text'
                      className={`form-control form-control-solid ps-12 ${formik.touched.id_persona && formik.errors.id_persona ? 'is-invalid' : ''}`}
                      placeholder='Buscar por nombre o CI...'
                      value={searchPersona}
                      onChange={(e) => {
                        setSearchPersona(e.target.value)
                        setPersonaSeleccionada(null)
                        formik.setFieldValue('id_persona', 0)
                      }}
                    />
                    {buscando && (
                      <span className='spinner-border spinner-border-sm position-absolute' style={{top: '12px', right: '12px'}}></span>
                    )}
                    {personaSeleccionada && (
                      <button
                        type='button'
                        className='btn btn-icon btn-sm btn-active-color-danger position-absolute'
                        style={{top: '4px', right: '4px'}}
                        onClick={() => {setPersonaSeleccionada(null); setSearchPersona(''); formik.setFieldValue('id_persona', 0)}}
                      >
                        <KTIcon iconName='cross' className='fs-4' />
                      </button>
                    )}
                  </div>
                  {personasEncontradas.length > 0 && (
                    <div className='card shadow position-absolute w-100 mt-1' style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                      <div className='card-body p-2'>
                        {personasEncontradas.map((p) => (
                          <div
                            key={p.id}
                            className='d-flex align-items-center p-2 rounded cursor-pointer hover-bg-light'
                            style={{cursor: 'pointer'}}
                            onClick={() => handleSelectPersona(p)}
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
                  {formik.touched.id_persona && formik.errors.id_persona && (
                    <div className='text-danger fs-7'>{formik.errors.id_persona}</div>
                  )}
                </div>

                <div className='row g-3 mb-5'>
                  {/* Turno */}
                  <div className='col-md-6'>
                    <label className='required fw-bold fs-6 mb-2'>Turno</label>
                    <select
                      className='form-select form-select-solid'
                      {...formik.getFieldProps('id_turno')}
                    >
                      <option value={0}>Seleccionar turno...</option>
                      {turnos.map((t) => (
                        <option key={t.id_turno} value={t.id_turno}>
                          {t.nombre} ({t.hora_inicio.slice(0,5)}–{t.hora_fin.slice(0,5)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bloque */}
                  <div className='col-md-6'>
                    <label className='fw-bold fs-6 mb-2'>Bloque / Área</label>
                    <select
                      className='form-select form-select-solid'
                      value={formik.values.id_bloque ?? ''}
                      onChange={(e) => formik.setFieldValue('id_bloque', e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value=''>Sin bloque</option>
                      {bloques.map((b) => (
                        <option key={b.id_bloque as number} value={b.id_bloque as number}>{b.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Observación */}
                <div className='fv-row mb-6'>
                  <label className='fw-bold fs-6 mb-2'>
                    Observación {!esFinDeSemana && <span className='text-danger fs-8'>(requerida para emergencias)</span>}
                  </label>
                  <textarea
                    className='form-control form-control-solid'
                    rows={2}
                    placeholder={esFinDeSemana ? 'Opcional...' : 'Motivo del cambio de emergencia...'}
                    {...formik.getFieldProps('observacion')}
                  />
                </div>

                <div className='d-flex justify-content-between'>
                  {esEdicion && (
                    <button type='button' className='btn btn-light-danger btn-sm' onClick={handleDeleteAsignacion}>
                      <KTIcon iconName='trash' className='fs-4 me-1' />
                      Quitar asignación
                    </button>
                  )}
                  <div className='ms-auto d-flex gap-2'>
                    <button type='button' className='btn btn-light' onClick={onClose}>Cancelar</button>
                    <button type='submit' className='btn btn-primary' disabled={loading || !formik.isValid}>
                      {loading ? (
                        <><span className='spinner-border spinner-border-sm me-2'></span>Guardando...</>
                      ) : 'Guardar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-backdrop fade show'></div>
    </>
  )
}

export {AsignacionModal}
