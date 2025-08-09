import {FC} from 'react'
import clsx from 'clsx'
import {KTIcon, WithChildren} from '../../../../helpers'
import {useLayout} from '../../../core'

type Props = {
  href: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
}

const SidebaExternalLink: FC<Props & WithChildren> = ({
  children,
  href,
  title,
  icon,
  fontIcon,
  hasBullet = false,
}) => {
  const {config} = useLayout()
  const {app} = config

  return (
    <div className='menu-item'>
      <a
        className={clsx('menu-link without-sub')}
        href={href}
        // target='_blank'
        rel='noopener noreferrer'
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}
        <span className='menu-title'>{title}</span>
      </a>
      {children}
    </div>
  )
}

export {SidebaExternalLink}
