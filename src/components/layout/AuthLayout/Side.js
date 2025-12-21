import React, { cloneElement } from 'react'
import { useSelector } from 'react-redux';
import Logo from 'components/template/Logo'
import {APP_NAME} from 'constants/app.constant';

const Side = ({children, content, ...rest }) => {

	const themeColor = useSelector((state) => state.theme.themeColor);
	const primaryColorLevel = useSelector((state) => state.theme.primaryColorLevel);
	const bgColor = `bg-${themeColor}-${primaryColorLevel}`
	
	return (
		<div className="grid lg:grid-cols-3 h-full">
			<div 
				className={`lg:flex side-nav-themed auth-main py-6 px-16 flex-col justify-between hidden `} 
			>
				<div></div>
				<div>
					<Logo className='flex justify-center' imgClass="w-10/12" mode="dark" />
				</div>
				<div className='flex justify-center'>
					<span className="text-white">Derechos de autor &copy;  {`${new Date().getFullYear()}`} <span className="font-semibold">{`${APP_NAME}`} </span> </span>
				</div>
			</div>
			<div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
				<div className="xl:min-w-[450px] px-8">
					<div className="mb-8">
						{content}
					</div>
					{children ? cloneElement(children, { ...rest }) : null}
				</div>
			</div>
		</div>
	)
}

export default Side