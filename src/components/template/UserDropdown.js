import React, { useEffect } from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'
import { themeConfig } from 'configs/theme.config'
import ModeSwitcher from 'components/template/ThemeConfigurator/ModeSwitcher'


const { textThemeColor } = themeConfig;

export const UserDropdown = ({ className }) => {

    const { user, employee, functionalPosition, organizationalUnit } = useSelector((state) => state.auth);
    const { current_route_key: currentRouteKey } = useSelector((state) => state.base.common);

    const { signOut } = useAuth();
    const ava = employee.photo ? employee.photo : '/img/avatars/nopic.jpg';

    const rolesText = (user.roles || user.authority || []).join(', ');


    useEffect(() => { }, [currentRouteKey])

    const UserAvatar = (
        <div className={classNames(className, 'flex items-center gap-2')}>
            <div className="hidden md:block text-right">
                <div>
                    <span className={`font-bold ${textThemeColor}`}>{user.name}</span>
                </div>
                <div className="text-sm">
                    <span className="font-semibold text-xs text-gray-500">
                        {rolesText || 'Sin rol'}
                    </span>
                </div>
            </div>
            <Avatar size={50} src={ava} shape="circle" icon={<HiOutlineUser />} />
        </div>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="flex items-center justify-center">
                        <ModeSwitcher />
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                <Dropdown.Item
                    onClick={signOut}
                    eventKey="Sign Out"
                    className="gap-2"
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Salir</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default withHeaderItem(UserDropdown)