import React from 'react'
import {
    HiHome,
    HiShieldCheck
} from 'react-icons/hi';

const Dgehm = () => {
    return (
        <div className='text-sm'>
            <img src='/img/logo/logo-dark-streamline.png' alt='dgehm' height={10} width={23} />
        </div>
    )
}

const navigationIcon = {
    home: <HiHome />,
    dgehm: <Dgehm />,
    security: <HiShieldCheck />,
}

export default navigationIcon
