
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import {
    HiOutlineHome,
    HiOutlineBookOpen,
    HiOutlineSparkles,
    HiOutlineDocumentText,
    HiOutlinePuzzlePiece,
    HiOutlineChartBar,
} from 'react-icons/hi2';

const navItems = [
    { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/notebook', icon: HiOutlineBookOpen, label: 'Notebook' },
    { path: '/solve', icon: HiOutlineSparkles, label: 'Solver' },
    { path: '/documents', icon: HiOutlineDocumentText, label: 'Documents' },
    { path: '/quizzes', icon: HiOutlinePuzzlePiece, label: 'Quizzes' },
    { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
];

const MobileMenu = ({ isOpen, onClose }) => {
    return (
        <>
            <AnimatePresence>
                {isOpen && <div onClick={() => { onClose(); }} className='bg-black/50 backdrop-blur-sm top-0 left-0 right-0 bottom-0 w-full h-full fixed z-[100]' />}
            </AnimatePresence>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="
                md:hidden absolute
                w-full
                top-[var(--navbar-height,66px)]
                z-[100]
                bg-[#0B0D0E]
                overflow-y-auto
                "
                    >
                        <nav className="px-3 py-3">
                            <div className="flex flex-col gap-1">
                                {navItems.map(({ path, icon: Icon, label }, index) => (
                                    <motion.div
                                        key={path}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.16,
                                            delay: index * 0.025,
                                            ease: 'easeOut',
                                        }}
                                    >
                                        <NavLink
                                            to={path}
                                            end={path === '/'}
                                            onClick={onClose}
                                            className={({ isActive }) => `
                                        relative flex items-center gap-3
                                        h-[46px] px-3.5
                                        rounded-md
                                        text-[13px]
                                        transition-colors duration-150
                                        ${isActive
                                                    ? 'bg-[#E3AD35]/[0.08] text-[#E3AD35]'
                                                    : 'text-[#91A0B0] hover:bg-white/[0.035] hover:text-[#F0EFEC]'
                                                }
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {isActive && (
                                                        <motion.span
                                                            layoutId="mobileMenuActive"
                                                            className="
                                                    absolute left-0 top-2.5 bottom-2.5
                                                    w-[2px] rounded-full
                                                    bg-[#E3AD35]
                                                    "
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 400,
                                                                damping: 32,
                                                            }}
                                                        />
                                                    )}

                                                    <Icon className="w-[19px] h-[19px] shrink-0" />

                                                    <span
                                                        className={
                                                            isActive ? 'font-medium' : 'font-normal'
                                                        }
                                                    >
                                                        {label}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileMenu;
