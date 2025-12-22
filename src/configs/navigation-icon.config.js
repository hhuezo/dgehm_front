import React from 'react'
import {
    // 1. Iconos ya usados
    HiHome,
    HiShieldCheck,
    HiOutlineArchive,

    // 2. Usuarios, Acceso y Comunicación
    HiOutlineUsers,
    HiOutlineUserCircle,
    HiOutlineUserAdd,
    HiOutlineKey,
    HiOutlineMail,

    // 3. Documentos, Archivos y Datos
    HiOutlineDocumentText,
    HiOutlineFolder,
    HiOutlineDatabase,
    HiOutlineDownload,
    HiOutlineUpload,

    // 4. Herramientas, Configuración y Estado
    HiOutlineCog,
    HiOutlineChartBar,
    HiOutlineSearch,
    HiOutlineInformationCircle,
    HiOutlineStatusOnline,

    // 5. Finanzas, Logística y Tareas
    HiOutlineCash,
    HiOutlineShoppingCart,
    HiOutlineTruck,
    HiOutlineTag,
    HiOutlineClipboardList,
    HiOutlineCalendar,
    HiOutlineClock,

} from 'react-icons/hi';

const Dgehm = () => {
    return (
        <div className='text-sm'>
            <img src='/img/logo/logo-dark-streamline.png' alt='dgehm' height={10} width={23} />
        </div>
    )
}

const navigationIcon = {
    // --- ICONOS BASE ---
    home: <HiHome />,
    dgehm: <Dgehm />,
    security: <HiShieldCheck />,
    inventary: <HiOutlineArchive />,

    // --- USUARIOS Y ACCESO ---
    users: <HiOutlineUsers />,
    profile: <HiOutlineUserCircle />,
    key: <HiOutlineKey />,

    // --- GESTIÓN DE DATOS Y ARCHIVOS ---
    documents: <HiOutlineDocumentText />,
    files: <HiOutlineFolder />,
    database: <HiOutlineDatabase />,
    download: <HiOutlineDownload />,
    upload: <HiOutlineUpload />,

    // --- CONFIGURACIÓN Y REPORTES ---
    settings: <HiOutlineCog />,
    reports: <HiOutlineChartBar />,
    search: <HiOutlineSearch />,
    info: <HiOutlineInformationCircle />,
    status: <HiOutlineStatusOnline />,

    // --- OPERACIONES Y LOGÍSTICA ---
    sales: <HiOutlineCash />,
    shopping: <HiOutlineShoppingCart />,
    truck: <HiOutlineTruck />,
    tag: <HiOutlineTag />,

    // --- TAREAS Y TIEMPO ---
    tasks: <HiOutlineClipboardList />,
    calendar: <HiOutlineCalendar />,
    time: <HiOutlineClock />,

    // Opciones adicionales que pueden ser útiles
    mail: <HiOutlineMail />,
    user_add: <HiOutlineUserAdd />,

}

export default navigationIcon