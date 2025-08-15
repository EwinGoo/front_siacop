/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {SidebaExternalLink} from './SidebaExternalLink'
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const {currentUser} = useAuth()
  const menu = currentUser?.menu || {}

  const renderMenuItem = (item, icon, hasBullet = false, fontIcon?: string, isSimple?: boolean) => {
    if (item.type === 'mvc') {
      return (
        <SidebaExternalLink
          href={item.url}
          title={item.label}
          fontIcon={fontIcon}
          icon={isSimple ? item.icon || icon : undefined}
          hasBullet={hasBullet}
        />
      )
    }
    return (
      <SidebarMenuItem
        to={item.url}
        title={item.label}
        icon={isSimple ? item.icon || icon : undefined}
        fontIcon={fontIcon}
        hasBullet={hasBullet}
      />
    )
  }

  return (
    <>
      {Object.values(menu).map((section, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          {/* Título de sección */}
          <div className='menu-item'>
            <div className='menu-content pt-4 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                {section.menuSectionTitle}
              </span>
            </div>
          </div>

          {/* Renderizamos elementos en el orden que manda el backend */}
          {section.elements?.map((element, index) => {
            if (element.items) {
              // Submenú
              return (
                <SidebarMenuItemWithSub
                  key={index}
                  // to={element.items[0]?.url || '#'}
                  to='#'
                  title={element.subMenuTitle}
                  icon={element.icon}
                  fontIcon='bi-person'
                >
                  {element.items.map((item, itemIndex) => (
                    <React.Fragment key={itemIndex}>
                      {renderMenuItem(item, element.icon, true)}
                    </React.Fragment>
                  ))}
                </SidebarMenuItemWithSub>
              )
            } else {
              // Enlace simple
              return (
                <React.Fragment key={index}>
                  {renderMenuItem(element, element.icon, false, 'bi-person', true)}
                </React.Fragment>
              )
            }
          })}
        </React.Fragment>
      ))}
    </>
  )
}

export {SidebarMenuMain}
