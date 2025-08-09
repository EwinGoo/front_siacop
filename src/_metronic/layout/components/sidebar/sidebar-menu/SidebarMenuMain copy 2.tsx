/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {SidebaExternalLink} from './SidebaExternalLink' // Nuevo componente para MVC
import {useAuth} from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const {currentUser} = useAuth()
  const menu = currentUser?.menu || {}

  const renderMenuItem = (item, icon, hasBullet = false, fontIcon?: string, isSimple?) => {
    if (item.type === 'mvc') {
      return (
        <SidebaExternalLink
          href={item.url}
          title={item.label}
          // icon={item.icon || icon}
          // fontIcon={fontIcon}
          hasBullet={hasBullet}
        />
      )
    }
    // default: react
    return (
      <SidebarMenuItem
        to={item.url}
        title={item.label}
        icon={isSimple ? item.icon || icon : undefined}
        // icon={item.icon || icon}
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

          {/* Submenús colapsables */}
          {section.menus &&
            section.menus.map((submenu, subIndex) => (
              <SidebarMenuItemWithSub
                key={subIndex}
                to='#'
                title={submenu.subMenuTitle}
                icon={submenu.icon}
                fontIcon='bi-list'
              >
                {submenu.items.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    {renderMenuItem(item, submenu.icon, true)}
                  </React.Fragment>
                ))}
              </SidebarMenuItemWithSub>
            ))}

          {/* Enlaces simples */}
          {section.items &&
            section.items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                {renderMenuItem(item, item.icon, false, 'bi-link', true)}
              </React.Fragment>
            ))}
        </React.Fragment>
      ))}
    </>
  )
}

export {SidebarMenuMain}
