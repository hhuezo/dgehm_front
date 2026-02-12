import React, { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useSelector } from 'react-redux'
import { Menu, Dropdown } from 'components/ui'
import { Link } from 'react-router-dom'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Trans } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'

const { MenuItem, MenuCollapse } = Menu

const hasNavPermission = (userPermissions = [], permissions = []) => {
    if (isEmpty(permissions) || typeof permissions === 'undefined') return true
    if (isEmpty(userPermissions)) return false
    return permissions.some((p) => userPermissions.includes(p))
}

const DefaultItem = ({ nav, onLinkClick, userPermissions }) => {
    const { employee, functionalPosition } = useSelector((state) => state.auth)

    const subNavsFiltered = useMemo(() => {
        const byPosAndEmp = (nav.subMenu || []).filter((subNav) => {
            const okPos = !subNav.pos || (subNav.pos?.length > 0 && subNav.pos.includes(functionalPosition?.id))
            const okEmp = subNav.emps?.length > 0 && subNav.emps.includes(employee?.id)
            return okPos || okEmp
        })
        return byPosAndEmp.filter((subNav) =>
            hasNavPermission(userPermissions, subNav.permissions || subNav.authority)
        )
    }, [nav.subMenu, functionalPosition?.id, employee?.id, userPermissions])

    if (subNavsFiltered.length === 0) {
        return null
    }

    return (
        <AuthorityCheck userPermissions={userPermissions} permissions={nav.permissions || nav.authority}>
            <MenuCollapse
                label={
                    <>
                        <VerticalMenuIcon icon={nav.icon} />
                        <span className="text-inherit">
                            <Trans i18nKey={nav.translateKey} defaults={nav.title} />
                        </span>
                    </>
                }
                key={nav.key}
                eventKey={nav.key}
                expanded={false}
                className="mb-2"
            >
                {subNavsFiltered.map((subNav) => (
                    <MenuItem
                        key={subNav.key}
                        eventKey={subNav.key}
                        className="menu-item"
                        activeClassName="menu-item-active"
                    >
                        {subNav.path ? (
                            <Link
                                className="h-full w-full flex items-center"
                                onClick={() =>
                                    onLinkClick?.({
                                        key: subNav.key,
                                        title: subNav.title,
                                        path: subNav.path,
                                    })
                                }
                                to={subNav.path}
                            >
                                <span>
                                    <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                                </span>
                            </Link>
                        ) : (
                            <span>
                                <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                            </span>
                        )}
                    </MenuItem>
                ))}
            </MenuCollapse>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({ nav, onLinkClick, userPermissions, direction }) => {
    const subNavsFiltered = useMemo(() => {
        return (nav.subMenu || []).filter((subNav) =>
            hasNavPermission(userPermissions, subNav.permissions || subNav.authority)
        )
    }, [nav.subMenu, userPermissions])

    if (subNavsFiltered.length === 0) {
        return null
    }

    const menuItem = (
        <MenuItem key={nav.key} eventKey={nav.key} className="mb-2 menu-item">
            <Link
                className="h-full w-full flex items-center"
                onClick={() =>
                    onLinkClick?.({
                        key: nav.key,
                        title: nav.title,
                        path: nav.path,
                    })
                }
                to={nav.path}
            >
                <VerticalMenuIcon icon={nav.icon} />
            </Link>
        </MenuItem>
    )

    return (
        <AuthorityCheck userPermissions={userPermissions} permissions={nav.permissions || nav.authority}>
            <Dropdown
                trigger="click"
                renderTitle={menuItem}
                placement={direction === 'rtl' ? 'middle-end-top' : 'middle-start-top'}
            >
                {subNavsFiltered.map((subNav) => (
                    <Dropdown.Item key={subNav.key} eventKey={subNav.key}>
                        {subNav.path ? (
                            <Link
                                className="h-full w-full flex items-center"
                                onClick={() =>
                                    onLinkClick?.({
                                        key: subNav.key,
                                        title: subNav.title,
                                        path: subNav.path,
                                    })
                                }
                                to={subNav.path}
                            >
                                <span>
                                    <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                                </span>
                            </Link>
                        ) : (
                            <span>
                                <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
                            </span>
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        </AuthorityCheck>
    )
}

const VerticalCollapsedMenuItemCustom = ({ sideCollapsed, ...rest }) => {
    return sideCollapsed ? <CollapsedItem {...rest} /> : <DefaultItem  {...rest} />
}

export default VerticalCollapsedMenuItemCustom
