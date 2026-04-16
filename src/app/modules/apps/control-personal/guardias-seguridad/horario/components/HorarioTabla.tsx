import {useMemo} from 'react'
import {HorarioSemanalResponse, GrupoInfo, TurnoInfo} from '../core/_models'
import {KTIcon} from 'src/_metronic/helpers'

type Props = {
  horario: HorarioSemanalResponse
}

const DIAS_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const HorarioTabla = ({horario}: Props) => {
  const {grupos, turnos, dias, semana} = horario

  // Mapa rotación semana: turnoId → grupo
  const rotacion = useMemo(() => {
    if (!semana.posicion_ciclo || !grupos.length || !turnos.length) return {}
    const map: Record<number, GrupoInfo> = {}
    grupos.forEach((grupo, gIdx) => {
      const turnoIdx = (gIdx + (semana.posicion_ciclo! - 1)) % turnos.length
      map[turnos[turnoIdx].id_turno] = grupo
    })
    return map
  }, [grupos, turnos, semana.posicion_ciclo])

  // Construir filas: una por persona (union de todos los grupos)
  const todasPersonas = useMemo(() => {
    const personas: Array<{
      id_persona: number
      ci: string
      nombre: string
      paterno: string
      materno: string
      grupo?: GrupoInfo
      turnoRotacion?: TurnoInfo
    }> = []

    grupos.forEach((grupo) => {
      const turnoIdx = semana.posicion_ciclo
        ? (grupo.orden - 1 + semana.posicion_ciclo - 1) % turnos.length
        : 0
      const turno = turnos[turnoIdx]
      grupo.miembros.forEach((m) => {
        personas.push({
          id_persona: m.id_persona,
          ci: m.ci,
          nombre: m.nombre,
          paterno: m.paterno,
          materno: m.materno,
          grupo,
          turnoRotacion: turno,
        })
      })
    })
    return personas.sort((a, b) => a.paterno.localeCompare(b.paterno))
  }, [grupos, turnos, semana.posicion_ciclo])

  return (
    <div className='table-responsive'>
      <table className='table table-row-bordered table-row-gray-100 align-middle fs-7 dataTable'>
        <thead>
          <tr className='text-uppercase fw-bolder text-muted fs-8 gs-0'>
            <th className='min-w-160px'>Guardia</th>
            <th>Grupo</th>
            <th>Turno semana</th>
            {DIAS_LABELS.map((d) => (
              <th key={d} className='text-center min-w-80px'>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {todasPersonas.length === 0 ? (
            <tr>
              <td colSpan={10} className='text-center text-muted py-8'>
                No hay guardias en ningún grupo
              </td>
            </tr>
          ) : (
            todasPersonas.map((p) => {
              const turnoColor = p.turnoRotacion?.color || '#e4e6ef'
              return (
                <tr key={p.id_persona}>
                  {/* Nombre */}
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-35px me-3'>
                        <span
                          className='symbol-label fw-bold fs-7'
                          style={{background: turnoColor + '33', color: turnoColor}}
                        >
                          {p.nombre?.charAt(0)}{p.paterno?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className='fw-bolder text-dark'>{p.paterno} {p.materno} {p.nombre}</div>
                        <div className='text-muted fs-8'>CI: {p.ci}</div>
                      </div>
                    </div>
                  </td>

                  {/* Grupo */}
                  <td>
                    <span className='badge badge-light-primary'>{p.grupo?.nombre}</span>
                  </td>

                  {/* Turno de la semana */}
                  <td>
                    {p.turnoRotacion ? (
                      <span
                        className='badge fs-7'
                        style={{background: p.turnoRotacion.color + '22', color: p.turnoRotacion.color, border: `1px solid ${p.turnoRotacion.color}`}}
                      >
                        {p.turnoRotacion.nombre}
                        <span className='ms-1 fw-normal opacity-75 fs-8'>
                          {p.turnoRotacion.hora_inicio.slice(0, 5)}–{p.turnoRotacion.hora_fin.slice(0, 5)}
                        </span>
                      </span>
                    ) : '—'}
                  </td>

                  {/* Asistencia por día */}
                  {dias.map((dia) => {
                    const asig = dia.asignaciones[p.id_persona]
                    if (!asig) {
                      return (
                        <td key={dia.fecha} className='text-center'>
                          {dia.es_fin_semana ? (
                            <span className='text-muted fs-9'>—</span>
                          ) : (
                            <KTIcon iconName='minus-circle' className='text-muted fs-4' />
                          )}
                        </td>
                      )
                    }
                    const esEmg = asig.tipo_origen === 'EMERGENCIA'
                    const esMan = asig.tipo_origen === 'MANUAL'
                    return (
                      <td key={dia.fecha} className='text-center'>
                        <span
                          className='badge'
                          style={{
                            background: asig.color_turno + '22',
                            color: asig.color_turno,
                            border: esEmg ? '1px solid #f1416c' : esMan ? '1px dashed #ffc700' : `1px solid ${asig.color_turno}`,
                          }}
                          title={`${asig.nombre_turno} ${asig.nombre_bloque ? '· ' + asig.nombre_bloque : ''}`}
                        >
                          {esEmg ? '⚡' : esMan ? '✋' : '✓'}
                          {asig.nombre_bloque ? (
                            <span className='ms-1 fs-9 fw-normal'>{asig.nombre_bloque}</span>
                          ) : null}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export {HorarioTabla}
