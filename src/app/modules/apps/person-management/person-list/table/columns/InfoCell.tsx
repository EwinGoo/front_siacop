/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx';
import { FC } from 'react';
import { toAbsoluteUrl } from '../../../../../../../_metronic/helpers';
import { Persona } from '../../core/_models';

type Props = {
  persona: Persona;
};

const InfoCell: FC<Props> = ({ persona }) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    {/* <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {persona.avatar ? (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`/media/${persona.avatar}`)} alt={persona.nombre} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              `bg-light-${persona.initials?.state}`,
              `text-${persona.initials?.state}`
            )}
          >
            {persona.initials?.label}
          </div>
        )}
      </a>
    </div> */}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {persona.nombre} {persona.apellido}
      </a>
      <span>{persona.email}</span>
    </div>
  </div>
);

export {InfoCell };