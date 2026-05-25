# Módulo Frontend: Asignaciones Administrativas

## Estado actual

- Implementado en `client/`:
  - `src/app/modules/apps/control-personal/asignaciones-administrativas/AsignacionesAdministrativasPage.tsx`
  - `src/app/modules/apps/control-personal/asignaciones-administrativas/core/_models.ts`
  - `src/app/modules/apps/control-personal/asignaciones-administrativas/core/_requests.ts`
- Ruta React:
  - `/apps/asignaciones-administrativas/listar`
- API consumida desde `client`:
  - `/api/v1/control-personal/asignacion-administrativo`
- Acceso:
  - solo usuarios del grupo `administrador`
- Menú:
  - se agregó la entrada en el bloque `Administrador`

## Integración con el frontend React

El frontend consumirá la API de asignaciones administrativas a través de **server** (no directo a api_base_upea).

## Estructura esperada

```
client/src/app/modules/apps/asignaciones-administrativas/
├── list/
│   ├── AsignacionesAdministrativasListPage.tsx        # Página principal
│   ├── ListHeader.tsx                                  # Encabezado con acciones
│   ├── ListSearchComponent.tsx                         # Buscador
│   └── ListToolbar.tsx                                 # Toolbar con filtros
├── components/
│   ├── Table.tsx                                       # Tabla para desktop
│   ├── Cards.tsx                                       # Cards para mobile
│   ├── ListPagination.tsx                              # Paginación
│   ├── AsignacionModal.tsx                             # Modal crear/editar
│   └── DeleteConfirmModal.tsx                          # Confirmar eliminación
├── core/
│   ├── QueryRequestProvider.tsx                        # Estado de request
│   ├── QueryResponseProvider.tsx                       # Estado de response
│   └── ListViewProvider.tsx                            # Estado compartido
├── _models.ts                                          # Tipos TypeScript
├── _requests.ts                                        # API calls
└── index.tsx                                           # Componente raíz
```

## Tipos TypeScript (_models.ts)

```typescript
/**
 * Asignación Administrativa
 */
export interface AsignacionAdministrativa {
  id_asignacion_administrativo: number;
  id_persona_administrativo: number;
  id_poa: number;
  id_nivel?: number | null;
  id_tipo_horario?: number | null;
  fecha_inicio_asignacion_administrativo: string; // YYYY-MM-DD
  fecha_fin_asignacion_administrativo?: string | null;
  numero_memorandum?: string | null;
  fecha_creacion_memorandum?: string | null;
  tipo_contratacion?: 'CONVOCATORIA' | 'DESIGNACION' | 'CONTRATO' | 'HONORARIOS' | null;
  codigo_cargo?: string | null;
  url_memorandum?: string | null;
  estado_asignacion_administrativo: boolean;
  fecha_finalizacion_asignacion?: string | null;
  detalle_finalizacion_asignacion?: string | null;
  fecha_creacion_asignacion_administrativo?: string | null;
  persona?: {
    ci: string;
    nombre: string;
    paterno: string;
    materno: string;
  };
}

/**
 * Request para crear/actualizar
 */
export interface CreateUpdateAsignacionAdministrativoRequest {
  id_persona_administrativo?: number;
  id_poa?: number;
  id_nivel?: number | null;
  id_tipo_horario?: number | null;
  fecha_inicio_asignacion_administrativo?: string;
  fecha_fin_asignacion_administrativo?: string | null;
  numero_memorandum?: string | null;
  fecha_creacion_memorandum?: string | null;
  tipo_contratacion?: 'CONVOCATORIA' | 'DESIGNACION' | 'CONTRATO' | 'HONORARIOS' | null;
  codigo_cargo?: string | null;
  url_memorandum?: string | null;
  estado_asignacion_administrativo?: boolean;
  detalle_finalizacion_asignacion?: string | null;
}

/**
 * Response del listado
 */
export interface ListarAsignacionesResponse {
  data: AsignacionAdministrativa[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Estado del módulo
 */
export interface AsignacionesListState {
  asignaciones: AsignacionAdministrativa[];
  loading: boolean;
  error: string | null;
  search: string;
  page: number;
  limit: number;
  total: number;
}
```

## Requests (_requests.ts)

```typescript
import { axiosClient } from 'app/config/apiClient';
import { API_ROUTES } from 'app/config/apiRoutes';
import {
  AsignacionAdministrativa,
  CreateUpdateAsignacionAdministrativoRequest,
  ListarAsignacionesResponse,
} from './_models';

// Configurar ruta en apiRoutes.ts
// export const API_ROUTES = {
//   ...
//   ASIGNACIONES_ADMINISTRATIVAS: '/api/asignacion-administrativo',
// };

/**
 * Listar asignaciones con búsqueda y paginación
 */
export const listarAsignacionesAdministrativas = async (
  search: string = '',
  page: number = 1,
  limit: number = 20
): Promise<ListarAsignacionesResponse> => {
  try {
    const response = await axiosClient.get(API_ROUTES.ASIGNACIONES_ADMINISTRATIVAS, {
      params: { search, page, limit },
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtener asignación por ID
 */
export const obtenerAsignacionAdministrativa = async (
  id: number
): Promise<AsignacionAdministrativa> => {
  try {
    const response = await axiosClient.get(
      `${API_ROUTES.ASIGNACIONES_ADMINISTRATIVAS}/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Crear asignación
 */
export const crearAsignacionAdministrativa = async (
  data: CreateUpdateAsignacionAdministrativoRequest
): Promise<AsignacionAdministrativa> => {
  try {
    const response = await axiosClient.post(
      API_ROUTES.ASIGNACIONES_ADMINISTRATIVAS,
      data
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Actualizar asignación
 */
export const actualizarAsignacionAdministrativa = async (
  id: number,
  data: CreateUpdateAsignacionAdministrativoRequest
): Promise<AsignacionAdministrativa> => {
  try {
    const response = await axiosClient.put(
      `${API_ROUTES.ASIGNACIONES_ADMINISTRATIVAS}/${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Eliminar asignación
 */
export const eliminarAsignacionAdministrativa = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`${API_ROUTES.ASIGNACIONES_ADMINISTRATIVAS}/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Obtener asignaciones por persona
 */
export const obtenerAsignacionesPorPersona = async (
  idPersona: number
): Promise<AsignacionAdministrativa[]> => {
  try {
    const response = await axiosClient.get(
      `${API_ROUTES.ASIGNACIONES_ADMINISTRATIVAS}/persona/${idPersona}`
    );
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Utilidad para manejar errores
 */
function handleApiError(error: any): Error {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.message) {
    return error;
  }
  return new Error('Error desconocido');
}
```

## Patrón de componente

```typescript
// src/app/modules/apps/asignaciones-administrativas/list/AsignacionesAdministrativasListPage.tsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listarAsignacionesAdministrativas } from '../_requests';
import ListHeader from './ListHeader';
import ListSearchComponent from './ListSearchComponent';
import ListToolbar from './ListToolbar';
import Table from '../components/Table';
import Cards from '../components/Cards';
import ListPagination from '../components/ListPagination';

export const AsignacionesAdministrativasListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // React Query para listar
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['asignaciones-administrativas', search, page, limit],
    queryFn: () => listarAsignacionesAdministrativas(search, page, limit),
    keepPreviousData: true,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className='card'>
      <ListHeader onRefresh={handleRefresh} />
      <ListSearchComponent onSearch={handleSearch} />
      <ListToolbar limit={limit} onLimitChange={setLimit} />

      {isLoading && <div className='alert alert-info'>Cargando...</div>}
      {error && <div className='alert alert-danger'>{error.message}</div>}

      {data && (
        <>
          {isMobile ? (
            <Cards asignaciones={data.data} onRefresh={handleRefresh} />
          ) : (
            <Table asignaciones={data.data} onRefresh={handleRefresh} />
          )}

          {data.total > 0 && (
            <ListPagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AsignacionesAdministrativasListPage;
```

## Dualidad desktop/mobile

### Desktop (Tabla)

```typescript
// Mostrar todos los datos en columnas
const columns = [
  { key: 'ci', label: 'CI', width: '100px' },
  { key: 'nombre', label: 'Nombre', width: '200px' },
  { key: 'tipo_contratacion', label: 'Tipo', width: '100px' },
  { key: 'fecha_inicio', label: 'Inicio', width: '100px' },
  { key: 'estado', label: 'Estado', width: '80px' },
  { key: 'acciones', label: 'Acciones', width: '120px' },
];
```

### Mobile (Cards)

```typescript
// Mostrar lo esencial, detalles en modal
<Card>
  <h5>{persona.nombre} {persona.paterno}</h5>
  <small>{persona.ci}</small>
  <p>{tipo_contratacion}</p>
  <Button onClick={() => openDetailModal(id)}>Ver detalles</Button>
</Card>
```

## Formulario de crear/editar

```typescript
// AsignacionModal.tsx
export const AsignacionModal: React.FC<Props> = ({ isOpen, asignacion, onSave, onClose }) => {
  const [formData, setFormData] = useState<CreateUpdateAsignacionAdministrativoRequest>({
    id_persona_administrativo: asignacion?.id_persona_administrativo || '',
    id_poa: asignacion?.id_poa || '',
    tipo_contratacion: asignacion?.tipo_contratacion || 'DESIGNACION',
    fecha_inicio_asignacion_administrativo: asignacion?.fecha_inicio_asignacion_administrativo || '',
    estado_asignacion_administrativo: asignacion?.estado_asignacion_administrativo ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (asignacion?.id_asignacion_administrativo) {
        await actualizarAsignacionAdministrativa(
          asignacion.id_asignacion_administrativo,
          formData
        );
      } else {
        await crearAsignacionAdministrativa(formData);
      }
      toast.success('Guardado exitosamente');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        <FormGroup>
          <Label>Tipo de contratación</Label>
          <Select
            value={formData.tipo_contratacion}
            onChange={(e) =>
              setFormData({ ...formData, tipo_contratacion: e.target.value })
            }
          >
            <option value='CONVOCATORIA'>Convocatoria</option>
            <option value='DESIGNACION'>Designación</option>
            <option value='CONTRATO'>Contrato</option>
            <option value='HONORARIOS'>Honorarios</option>
          </Select>
        </FormGroup>

        <Button type='submit'>Guardar</Button>
        <Button type='button' onClick={onClose}>
          Cancelar
        </Button>
      </Form>
    </Modal>
  );
};
```

## Ruta en AppRoutes

```typescript
// src/app/routing/PrivateRoutes.tsx

import AsignacionesAdministrativasListPage from 'app/modules/apps/asignaciones-administrativas';

export const PrivateRoutes: React.FC = () => (
  <Routes>
    {/* ... otras rutas ... */}
    <Route
      path='asignaciones-administrativas'
      element={<AsignacionesAdministrativasListPage />}
    />
  </Routes>
);
```

## Menu entry

Agregar a la navegación en el sidebar:

```typescript
{
  title: 'Asignaciones Admin.',
  icon: 'ki-notepad',
  path: '/asignaciones-administrativas',
  role: ['admin', 'rrhh'],
}
```

## Convenciones

- **Nombres de variable**: snake_case como viene de la API
- **Tipos**: Interfases para cada modelo
- **Errores**: Mostrar `error.message` en toast
- **Loading**: Skeleton o spinner mientras se carga
- **Búsqueda**: Debounce de 300ms
- **Paginación**: Limite máximo 100

## Testing

```typescript
// Ejemplo con React Testing Library
import { render, screen } from '@testing-library/react';

test('Debería mostrar listado de asignaciones', async () => {
  render(<AsignacionesAdministrativasListPage />);

  await screen.findByText('CI');
  expect(screen.getByText('Pérez')).toBeInTheDocument();
});

test('Debería crear asignación', async () => {
  render(<AsignacionesAdministrativasListPage />);
  const newButton = screen.getByRole('button', { name: /nuevo/i });
  fireEvent.click(newButton);
  // ... llenar formulario y enviar
});
```

## Próximos pasos

1. ✅ Crear types (_models.ts)
2. ✅ Crear requests (_requests.ts)
3. ⏳ Crear ListPage
4. ⏳ Crear Table y Cards
5. ⏳ Crear Modal
6. ⏳ Agregar a rutas
7. ⏳ Agregar a menu
