import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import CloseButton from '../CloseButton'
import { motion } from 'framer-motion'

const Drawer = ({
    children,
    className,
    closable = false,
    width = 400,
    height = 400,
    isOpen,
    onClose,
    closeTimeoutMS = 300,
    placement = 'right',
    bodyOpenClassName,
    portalClassName,
    overlayClassName,
    title,
    footer,
    headerClass,
    footerClass,
    bodyClass,
    showBackdrop = true,
    lockScroll = true,
    ...rest
}) => {
    const onCloseClick = (e) => {
        onClose(e)
    }

    const [drawerWidth, setDrawerWidth] = useState(60)

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth
            if (screenWidth < 640) {
                setDrawerWidth(100)
            } else if (screenWidth >= 640 && screenWidth < 768) {
                setDrawerWidth(100)
            } else if (screenWidth >= 768 && screenWidth < 1024) {
                setDrawerWidth(50)
            } else if (screenWidth >= 1024 && screenWidth < 1280) {
                setDrawerWidth(50)
            } else if (screenWidth >= 1280 && screenWidth < 1536) {
                setDrawerWidth(50)
            } else {
                setDrawerWidth(50)
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const renderCloseButton = <CloseButton onClick={onCloseClick} />

    const getStyle = () => {
        if (placement === 'left' || placement === 'right') {
            const customWidth = drawerWidth > 100 ? window.innerWidth : window.innerWidth * (drawerWidth / 100)
            return {
                dimensionClass: 'vertical',
                contentStyle: { width: customWidth },
                motionStyle: {
                    [placement]: `-${customWidth}${typeof customWidth === 'number' && 'px'}`,
                },
            }
        }

        if (placement === 'top' || placement === 'bottom') {
            return {
                dimensionClass: 'horizontal',
                contentStyle: { height },
                motionStyle: {
                    [placement]: `-${height}${typeof height === 'number' && 'px'}`,
                },
            }
        }
    }

    const { dimensionClass, contentStyle, motionStyle } = getStyle()

    return (
        <Modal
            className={{
                base: classNames('drawer', className),
                afterOpen: 'drawer-after-open',
                beforeClose: 'drawer-before-close',
            }}
            overlayClassName={{
                base: classNames(
                    'drawer-overlay',
                    overlayClassName,
                    !showBackdrop && 'bg-transparent'
                ),
                afterOpen: 'drawer-overlay-after-open',
                beforeClose: 'drawer-overlay-before-close',
            }}
            portalClassName={classNames('drawer-portal', portalClassName)}
            bodyOpenClassName={classNames(
                'drawer-open',
                lockScroll && 'drawer-lock-scroll',
                bodyOpenClassName
            )}
            ariaHideApp={false}
            isOpen={isOpen}
            closeTimeoutMS={closeTimeoutMS}
            {...rest}
        >
            <motion.div
                className={classNames('drawer-content', dimensionClass)}
                style={contentStyle}
                initial={motionStyle}
                animate={{
                    [placement]: isOpen ? 0 : motionStyle[placement],
                }}
            >

                {title || closable ? (
                    <div className={classNames('drawer-header', headerClass)}>
                        {typeof title === 'string' ? (
                            <h4>{title}</h4>
                        ) : (
                            <span>{title}</span> // 👈 Si 'title' es un nodo React (como un Button), se renderiza aquí
                        )}
                        {closable && renderCloseButton} // Se evalúa si renderizar el botón de cierre
                    </div>
                ) : null}
                <div className={classNames('drawer-body', bodyClass)}>
                    {children}
                </div>
                {footer && (
                    <div className={classNames('drawer-footer', footerClass)}>
                        {footer}
                    </div>
                )}
            </motion.div>
        </Modal>
    )
}

Drawer.propTypes = {
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    width: PropTypes.number,
    height: PropTypes.number,
    closable: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    headerClass: PropTypes.string,
    footerClass: PropTypes.string,
    bodyClass: PropTypes.string,
    showBackdrop: PropTypes.bool,
    lockScroll: PropTypes.bool,
    bodyOpenClassName: PropTypes.string,
    portalClassName: PropTypes.string,
    overlayClassName: PropTypes.string,
}

export default Drawer