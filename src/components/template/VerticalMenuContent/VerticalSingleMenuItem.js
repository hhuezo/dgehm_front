import React from 'react'
import { Menu, Tooltip } from 'components/ui'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'

const { MenuItem } = Menu

const CollapsedItem = ({ title, translateKey, children, direction }) => {
    const { t } = useTranslation()

    return (
        <Tooltip
            title={t(translateKey) || title}
            placement={direction === 'rtl' ? 'left' : 'right'}
        >
            {children}
        </Tooltip>
    )
}

const DefaultItem = (props) => {
    const { nav, onLinkClick, sideCollapsed, userPermissions } = props

    return (
        <AuthorityCheck userPermissions={userPermissions} permissions={nav.permissions || nav.authority}>
            <MenuItem
                key={nav.key}
                eventKey={nav.key}
                className="mb-2 menu-item"
                activeClassName="menu-item-active"
            >
                <Link
                    to={nav.path}
                    onClick={() =>
                        onLinkClick?.({
                            key: nav.key,
                            title: nav.title,
                            path: nav.path,
                        })
                    }
                    className="flex items-center h-full w-full text-inherit"
                >
                    <VerticalMenuIcon icon={nav.icon} />
                    {!sideCollapsed && (
                        <span>
                            <Trans
                                i18nKey={nav.translateKey}
                                defaults={nav.title}
                            />
                        </span>
                    )}
                </Link>
            </MenuItem>
        </AuthorityCheck>
    )
}

const VerticalSingleMenuItem = ({
    nav,
    onLinkClick,
    sideCollapsed,
    userPermissions,
    direction,
}) => {
    return (
        <AuthorityCheck userPermissions={userPermissions} permissions={nav.permissions || nav.authority}>
            {sideCollapsed ? (
                <CollapsedItem
                    title={nav.title}
                    translateKey={nav.translateKey}
                    direction={direction}
                >
                    <DefaultItem
                        nav={nav}
                        sideCollapsed={sideCollapsed}
                        onLinkClick={onLinkClick}
                        userPermissions={userPermissions}
                    />
                </CollapsedItem>
            ) : (
                <DefaultItem
                    nav={nav}
                    sideCollapsed={sideCollapsed}
                    onLinkClick={onLinkClick}
                    userPermissions={userPermissions}
                />
            )}
        </AuthorityCheck>
    )
}

export default VerticalSingleMenuItem
