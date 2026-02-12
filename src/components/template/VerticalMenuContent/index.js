import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { Menu } from 'components/ui'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalCollapsedMenuItemCustom from './VerticalCollapsedMenuItemCustom'
import { themeConfig } from 'configs/theme.config'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'
import useMenuActive from 'utils/hooks/useMenuActive'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const { MenuGroup } = Menu

const hasNavPermission = (userPermissions = [], permissions = []) => {
    if (isEmpty(permissions) || typeof permissions === 'undefined') return true
    if (isEmpty(userPermissions)) return false
    return permissions.some((p) => userPermissions.includes(p))
}

const VerticalMenuContent = (props) => {
    const {
        navMode = themeConfig.navMode,
        collapsed,
        routeKey,
        navigationTree = [],
        userPermissions = [],
        onMenuItemClick,
        direction = themeConfig.direction,
    } = props

    const { t } = useTranslation()

    const [defaulExpandKey, setDefaulExpandKey] = useState([])

    const { activedRoute } = useMenuActive(navigationTree, routeKey)

    useEffect(() => {
        if (defaulExpandKey.length === 0 && activedRoute?.parentKey) {
            setDefaulExpandKey([activedRoute?.parentKey])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activedRoute?.parentKey])

    const handleLinkClick = () => {
        onMenuItemClick?.()
    }

    const getNavItem = (nav) => {
        if (nav.subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
            return (
                <VerticalSingleMenuItem
                    key={nav.key}
                    nav={nav}
                    onLinkClick={handleLinkClick}
                    sideCollapsed={collapsed}
                    userPermissions={userPermissions}
                    direction={direction}
                />
            )
        }

        if (nav.subMenu.length > 0 && nav.type === NAV_ITEM_TYPE_COLLAPSE) {
            return (
                <VerticalCollapsedMenuItemCustom
                    key={nav.key}
                    nav={nav}
                    onLinkClick={onMenuItemClick}
                    sideCollapsed={collapsed}
                    userPermissions={userPermissions}
                    direction={direction}
                />
            )
        }

        if (nav.type === NAV_ITEM_TYPE_TITLE) {
            if (nav.subMenu.length > 0) {
                const visibleSubNavs = nav.subMenu.filter((subNav) =>
                    hasNavPermission(userPermissions, subNav.permissions || subNav.authority)
                )
                if (visibleSubNavs.length === 0) return null
                return (
                    <MenuGroup
                        key={nav.key}
                        label={t(nav.translateKey) || nav.title}
                    >
                        {visibleSubNavs.map((subNav) =>
                            subNav.subMenu?.length > 0 ? (
                                <VerticalCollapsedMenuItemCustom
                                    key={subNav.key}
                                    nav={subNav}
                                    onLinkClick={onMenuItemClick}
                                    sideCollapsed={collapsed}
                                    userPermissions={userPermissions}
                                    direction={direction}
                                />
                            ) : (
                                <VerticalSingleMenuItem
                                    key={subNav.key}
                                    nav={subNav}
                                    onLinkClick={onMenuItemClick}
                                    sideCollapsed={collapsed}
                                    userPermissions={userPermissions}
                                    direction={direction}
                                />
                            )
                        )}
                    </MenuGroup>
                )
            } else {
                return <MenuGroup key={nav.key} label={nav.title} />
            }
        }
        return null
    }

    const fp = useSelector(state => state.auth.functionalPosition.id);

    return (
        <Menu
            className="px-4 pb-4 text-[color:var(--c-body)]"
            variant={navMode}
            sideCollapsed={collapsed}
            defaultActiveKeys={activedRoute?.key ? [activedRoute.key] : []}
            defaultExpandedKeys={defaulExpandKey}
        >
            {
                navigationTree.map((nav) => {
                    if (!hasNavPermission(userPermissions, nav.permissions || nav.authority)) {
                        return null
                    }
                    const pos = nav.pos
                    if (pos && Object.values(pos).includes(fp)) {
                        return getNavItem(nav)
                    }
                    if (!pos) {
                        return getNavItem(nav)
                    }
                    return null
                })
            }
        </Menu>
    )
}

VerticalMenuContent.propTypes = {
    navMode: PropTypes.oneOf(['light', 'dark', 'themed', 'transparent']),
    collapsed: PropTypes.bool,
    routeKey: PropTypes.string,
    navigationTree: PropTypes.array,
    userPermissions: PropTypes.array,
    direction: PropTypes.oneOf(['rtl', 'ltr']),
}

export default VerticalMenuContent
