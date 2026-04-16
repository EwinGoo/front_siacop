import {useMemo} from 'react'
import {HorarioSemanalResponse, TurnoInfo, GrupoInfo, DiaSemana, AsignacionDia} from '../core/_models'
import {KTIcon} from 'src/_metronic/helpers'

type Props = {
  horario: HorarioSemanalResponse
  onEditAsignacion?: (fecha: string, asignacion?: AsignacionDia) => void
  canManage: boolean
}

const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const TurnoLabel = ({turno}: {turno: TurnoInfo}) => (
  <div
    className='d-flex align-items-center gap-2 px-3 py-2 rounded mb-1'
    style={{background: turno.color + '22', borderLeft: `3px solid ${turno.color}`}}
  >
    <span className='fw-bolder fs-7' style={{color: turno.color}}>{turno.nombre}</span>
    <span className='text-muted fs-8'>{turno.hora_inicio.slice(0, 5)}–{turno.hora_fin.slice(0, 5)}</span>
  </div>
)

const GuardiaChip = ({
  asignacion,
  onEdit,
  canManage,
}: {
  asignacion: AsignacionDia
  onEdit?: () => void
  canManage: boolean
}) => {
  const nombre = `${asignacion.paterno} ${asignacion.nombre_persona}`
  const esEmergencia = asignacion.tipo_origen === 'EMERGENCIA'
  const esManual = asignacion.tipo_origen === 'MANUAL'

  return (
    <div
      className={`d-flex align-items-center justify-content-between rounded px-2 py-1 mb-1 ${
        canManage ? 'cursor-pointer hover-bg-light' : ''
      }`}
      style={{background: '#f5f8fa', border: esEmergencia ? '1px solid #f1416c' : esManual ? '1px dashed #ffc700' : 'none'}}
      onClick={canManage ? onEdit : undefined}
      title={esEmergencia ? 'Cambio por emergencia' : esManual ? 'Asignación manual' : ''}
    >
      <div className='d-flex align-items-center gap-2'>
        <div className='symbol symbol-25px'>
          <span
            className='symbol-label fs-9 fw-bold'
            style={{background: asignacion.color_turno + '33', color: asignacion.color_turno}}
          >
            {asignacion.paterno?.charAt(0)}{asignacion.nombre_persona?.charAt(0)}
          </span>
        </div>
        <div>
          <div className='fw-bold fs-8 text-dark lh-1'>{nombre}</div>
          {asignacion.nombre_bloque && (
            <div className='text-muted fs-9'>
              <KTIcon iconName='geolocation' className='fs-9 me-1' />
              {asignacion.nombre_bloque}
            </div>
          )}
        </div>
      </div>
      {esEmergencia && <span className='badge badge-light-danger badge-sm py-1 px-2'>EMG</span>}
      {esManual && !esEmergencia && <span className='badge badge-light-warning badge-sm py-1 px-2'>MAN</span>}
    </div>
  )
}

const HorarioCalendario = ({horario, onEditAsignacion, canManage}: Props) => {
  const {dias, turnos, grupos, semana} = horario

  // Para días laborables (lun-vie): calcular qué grupo hace cada turno
  const rotacionSemana = useMemo(() => {
    if (!semana.posicion_ciclo || !grupos.length || !turnos.length) return {}
    const map: Record<number, GrupoInfo> = {} // turno_id → grupo
    const totalGrupos = grupos.length
    const totalTurnos = turnos.length
    grupos.forEach((grupo, gIdx) => {
      const turnoIdx = (gIdx + (semana.posicion_ciclo! - 1)) % totalTurnos
      map[turnos[turnoIdx].id_turno] = grupo
    })
    return map
  }, [grupos, turnos, semana.posicion_ciclo])

  return (
    <div className='table-responsive'>
      <table className='table table-bordered align-middle fs-7 mb-0' style={{minWidth: '900px'}}>
        {/* Encabezado: días */}
        <thead>
          <tr>
            <th className='w-120px bg-light text-center text-uppercase text-muted fw-bolder fs-8 py-3'>Turno</th>
            {dias.map((dia, i) => {
              const fecha = new Date(dia.fecha + 'T12:00:00')
              const esHoy = dia.fecha === new Date().toISOString().slice(0, 10)
              return (
                <th
                  key={dia.fecha}
                  className={`text-center py-3 ${dia.es_fin_semana ? 'bg-light-warning' : 'bg-light'} ${esHoy ? 'border-primary' : ''}`}
                  style={esHoy ? {borderBottom: '3px solid #009ef7'} : {}}
                >
                  <div className={`fw-bolder fs-7 ${esHoy ? 'text-primary' : 'text-dark'}`}>{DIAS_CORTOS[i]}</div>
                  <div className={`fs-8 ${esHoy ? 'text-primary' : 'text-muted'}`}>
                    {fecha.getDate()}/{fecha.getMonth() + 1}
                  </div>
                  {dia.es_fin_semana && (
                    <span className='badge badge-light-warning fs-9 mt-1'>Fin de semana</span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id_turno} style={{verticalAlign: 'top'}}>
              {/* Columna turno */}
              <td className='bg-light py-3 text-center'>
                <TurnoLabel turno={turno} />
              </td>

              {/* Celdas por día */}
              {dias.map((dia) => {
                const asignacionesDia = Object.values(dia.asignaciones).filter(
                  (a) => a.id_turno === turno.id_turno
                )
                const grupoRotacion = !dia.es_fin_semana ? rotacionSemana[turno.id_turno] : null

                return (
                  <td
                    key={dia.fecha}
                    className={`py-2 px-2 ${dia.es_fin_semana ? 'bg-light' : ''}`}
                    style={{minWidth: '130px', maxWidth: '200px'}}
                  >
                    {/* Label del grupo (solo días laborables) */}
                    {grupoRotacion && !dia.es_fin_semana && asignacionesDia.length === 0 && (
                      <div className='text-muted fs-8 text-center py-3'>
                        <div className='fw-bold'>{grupoRotacion.nombre}</div>
                        <div className='fs-9'>{grupoRotacion.miembros.length} guardias</div>
                        <div className='text-warning fs-9 mt-1'>Sin generar</div>
                      </div>
                    )}
                    {grupoRotacion && !dia.es_fin_semana && asignacionesDia.length > 0 && (
                      <div className='mb-1'>
                        <span className='badge badge-light-primary fs-9 mb-2'>{grupoRotacion.nombre}</span>
                      </div>
                    )}

                    {/* Guardias asignados */}
                    {asignacionesDia.map((asig) => (
                      <GuardiaChip
                        key={asig.id_asignacion}
                        asignacion={asig}
                        canManage={canManage}
                        onEdit={() => onEditAsignacion?.(dia.fecha, asig)}
                      />
                    ))}

                    {/* Botón agregar (fin de semana o emergencia) */}
                    {canManage && (
                      <button
                        className='btn btn-sm btn-light-primary w-100 mt-1 py-1 fs-9'
                        onClick={() => onEditAsignacion?.(dia.fecha, undefined)}
                        title={dia.es_fin_semana ? 'Asignar guardia este día' : 'Asignación por emergencia'}
                      >
                        <KTIcon iconName='plus' className='fs-7 me-1' />
                        {dia.es_fin_semana ? 'Asignar' : 'Emergencia'}
                      </button>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export {HorarioCalendario}
