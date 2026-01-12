import React from 'react'
import navigationConfig from 'configs/navigation.config'
import { Dropdown } from 'components/ui'
import { AuthorityCheck } from 'components/shared'
import HorizontalMenuItem from './HorizontalMenuItem'
import HorizontalMenuDropdownItem from './HorizontalMenuDropdownItem'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from 'constants/navigation.constant'
import { useTranslation } from 'react-i18next'

const HorizontalMenuContent = ({ manuVariant, userPermissions = [] }) => {
    const { t } = useTranslation()

    return (
        <span className="flex items-center">
            {navigationConfig.map((nav) => {
                if (
                    nav.type === NAV_ITEM_TYPE_TITLE ||
                    nav.type === NAV_ITEM_TYPE_COLLAPSE
                ) {
                    return (
                        <AuthorityCheck
                            permissions={nav.permissions || nav.authority}
                            userPermissions={userPermissions}
                            key={nav.key}
                        >
                            <Dropdown
                                trigger="hover"
                                renderTitle={
                                    <HorizontalMenuItem
                                        manuVariant={manuVariant}
                                        nav={nav}
                                    />
                                }
                            >
                                {nav.subMenu.map((secondarySubNav) => (
                                    <AuthorityCheck
                                        permissions={secondarySubNav.permissions || secondarySubNav.authority}
                                        userPermissions={userPermissions}
                                        key={secondarySubNav.key}
                                    >
                                        {secondarySubNav.subMenu.length > 0 ? (
                                            <Dropdown.Menu
                                                title={t(
                                                    secondarySubNav.translateKey,
                                                    secondarySubNav.title
                                                )}
                                            >
                                                {secondarySubNav.subMenu.map(
                                                    (tertiarySubNav) => (
                                                        <AuthorityCheck
                                                            permissions={
                                                                tertiarySubNav.permissions || tertiarySubNav.authority
                                                            }
                                                            userPermissions={
                                                                userPermissions
                                                            }
                                                            key={
                                                                tertiarySubNav.key
                                                            }
                                                        >
                                                            <HorizontalMenuDropdownItem
                                                                nav={
                                                                    tertiarySubNav
                                                                }
                                                            />
                                                        </AuthorityCheck>
                                                    )
                                                )}
                                            </Dropdown.Menu>
                                        ) : (
                                            <HorizontalMenuDropdownItem
                                                nav={secondarySubNav}
                                                key={secondarySubNav.key}
                                            />
                                        )}
                                    </AuthorityCheck>
                                ))}
                            </Dropdown>
                        </AuthorityCheck>
                    )
                }
                if (nav.type === NAV_ITEM_TYPE_ITEM) {
                    return (
                        <AuthorityCheck
                            permissions={nav.permissions || nav.authority}
                            userPermissions={userPermissions}
                            key={nav.key}
                        >
                            <HorizontalMenuItem
                                isLink
                                nav={nav}
                                manuVariant={manuVariant}
                            />
                        </AuthorityCheck>
                    )
                }
                return <></>
            })}
        </span>
    )
}

export default HorizontalMenuContent
