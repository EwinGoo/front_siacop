import { useMemo } from 'react';
import { useTable, ColumnInstance, Row } from 'react-table';
import { CustomHeaderColumn } from './columns/CustomHeaderColumn';
import { CustomRow } from './columns/CustomRow';
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider';
import { Columns } from './columns/_columns'; // Cambiar a columnas de Persona
import { Persona } from '../core/_models';
import { ListLoading } from '../components/loading/ListLoading';
import { ListPagination } from '../components/pagination/ListPagination';
import { KTCardBody } from '../../../../../../_metronic/helpers';

const PersonaTable = () => {
  const personas = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const data = useMemo(() => personas, [personas]);
  const columns = useMemo(() => Columns, []); // Cambiar a columnas de Persona
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // console.log(headers);
  

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_personas'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<Persona>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Persona>, i) => {
                prepareRow(row);
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No se encontraron registros
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ListPagination />
      {isLoading && <ListLoading />}
    </KTCardBody>
  );
};

export { PersonaTable };