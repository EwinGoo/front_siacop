import {FC} from 'react'
import clsx from 'clsx'
import {KTIcon} from '../../../../helpers'

type Props = {
  href: string
  title: string
  icon?: string
  fontIcon?: string
  hasArrow?: boolean
  hasBullet?: boolean
  target?: string
  rel?: string
}

const ExternalLink: FC<Props> = ({
  href,
  title,
  icon,
  fontIcon,
  hasArrow = false,
  hasBullet = false,
  // target = '_blank',
  rel = 'noopener noreferrer',
}) => {
  return (
    <div className='menu-item me-lg-1'>
      <a
        className={clsx('menu-link py-3')}
        href={href}
        // target={target}
        rel={rel}
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}

        {icon && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}

        {fontIcon && (
          <span className='menu-icon'>
            <i className={clsx('bi fs-3', fontIcon)}></i>
          </span>
        )}

        <span className='menu-title'>{title}</span>

        {hasArrow && <span className='menu-arrow'></span>}
      </a>
    </div>
  )
}

export {ExternalLink}
