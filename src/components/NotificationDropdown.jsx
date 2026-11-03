
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import {
    HiOutlineBell,
    HiOutlineDocumentText,
    HiOutlineSparkles,
    HiOutlineTrophy,
    HiOutlineXMark,
    HiOutlineArrowUpRight,
    HiOutlineCheck,
    HiOutlineCheckCircle,
} from 'react-icons/hi2';

// Replace these examples with notifications from your API.
const INITIAL_NOTIFICATIONS = [
    {
        id: '1',
        type: 'document',
        title: 'Welcome to NoteLM',
        message: 'Your learning workspace is ready. Upload your first document and start turning your notes into knowledge.',
        time: 'Just now',
        unread: true,
        actionLabel: 'Get started',
        actionPath: '/documents',
    },
    // {
    //     id: '2',
    //     type: 'quiz',
    //     title: 'Quiz completed',
    //     message: 'You completed your latest quiz. Check your results.',
    //     time: '2 hours ago',
    //     unread: true,
    //     actionLabel: 'View results',
    //     actionPath: '/quizzes',
    // },
    // {
    //     id: '3',
    //     type: 'goal',
    //     title: 'Weekly learning goal',
    //     message: 'You are making progress towards your weekly target.',
    //     time: 'Yesterday',
    //     unread: false,
    //     actionLabel: 'View progress',
    //     actionPath: '/analytics',
    // },
];

const notificationIcons = {
    document: HiOutlineDocumentText,
    quiz: HiOutlineSparkles,
    goal: HiOutlineTrophy,
};

const notificationColors = {
    document: 'text-[#70B5EC] bg-[#70B5EC]/[0.09]',
    quiz: 'text-[#B28AE9] bg-[#B28AE9]/[0.09]',
    goal: 'text-[#E3AD35] bg-[#E3AD35]/[0.09]',
};

export default function NotificationDropdown() {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [notifications, setNotifications] = useState(
        INITIAL_NOTIFICATIONS
    );

    const unreadCount = useMemo(
        () => notifications.filter(n => n.unread).length,
        [notifications]
    );

    // Close on outside click and Escape
    useEffect(() => {
        if (!open) return;

        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    // Mark one notification as read
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, unread: false }
                    : item
            )
        );
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(item => ({
                ...item,
                unread: false,
            }))
        );
    };

    // Remove one notification
    const removeNotification = (id) => {
        setNotifications(prev =>
            prev.filter(item => item.id !== id)
        );
    };

    // Remove all notifications
    const clearAll = () => {
        setNotifications([]);
    };

    // Handle notification action
    const handleAction = (notification) => {
        markAsRead(notification.id);
        setOpen(false);

        if (notification.actionPath) {
            navigate(notification.actionPath);
        }

        // For custom actions, add an onAction callback
        // to your notification object and invoke it here.
        notification.onAction?.();
    };

    const dropdownVariants = {
        hidden: {
            opacity: 0,
            y: -7,
            scale: 0.985,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.19,
                ease: [0.22, 1, 0.36, 1],
            },
        },
        exit: {
            opacity: 0,
            y: -5,
            scale: 0.99,
            transition: {
                duration: 0.13,
                ease: 'easeIn',
            },
        },
    };

    return (
        <div ref={dropdownRef} className="relative">

            {/* Notification trigger */}

            <button
                type="button"
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => setOpen(prev => !prev)}
                className={`
          relative w-9 h-9
          flex items-center justify-center
          rounded-md
          transition-colors duration-150
          ${open
                        ? 'bg-white/[0.055] text-[#E3AD35]'
                        : 'text-[#91A0B0] hover:text-[#E3AD35] hover:bg-white/[0.04]'
                    }
        `}
            >
                <HiOutlineBell className="w-[19px] h-[19px]" />

                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="
                absolute top-[7px] right-[7px]
                min-w-[7px] h-[7px]
                rounded-full
                bg-[#E3AD35]
                ring-2 ring-[#0B0D0E]
              "
                        />
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown panel */}

            <AnimatePresence>
                {open && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-label="Notifications"
                        className="
              absolute right-0 top-[calc(100%+13px)]
              w-[360px] max-w-[calc(100vw-24px)]
              bg-[#111415]
              border border-[#292D30]
              rounded-lg
              shadow-[0_16px_45px_rgba(0,0,0,0.45)]
              z-[100]
              overflow-hidden
            "
                    >

                        {/* Header */}

                        <div className="
              px-4 pt-4
              flex items-center justify-between
              borderb border-[#292D30]
            ">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="
                    text-[14px] font-semibold
                    text-[#F0EFEC]
                  ">
                                        Notifications
                                    </h3>

                                    {unreadCount > 0 && (
                                        <span className="
                      px-1.5 py-0.5
                      rounded
                      bg-[#E3AD35]/[0.10]
                      text-[#E3AD35]
                      text-[10px] font-semibold
                    ">
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>

                                {/* <p className="
                  text-[11px] text-[#78899C]
                  mt-1
                ">
                                    Your latest learning activity
                                </p> */}
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close notifications"
                                className="
                  p-1.5 rounded
                  text-[#718196]
                  hover:text-[#F0EFEC]
                  hover:bg-white/[0.05]
                  transition-colors
                "
                            >
                                <HiOutlineXMark className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Actions bar */}

                        {notifications.length > 0 && (
                            <div className="
                px-4 py-2.5
                flex items-center justify-between
                border-b border-[#252A2D]
              ">
                                {/* <span className="
                  text-[10px] uppercase
                  tracking-[0.12em]
                  text-[#68798B]
                  font-medium
                ">
                                    Recent activity
                                </span> */}

                                <div className="flex items-center gap-3">

                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={markAllAsRead}
                                            className="
                        text-[11px]
                        text-[#91A0B0]
                        hover:text-[#E3AD35]
                        transition-colors
                      "
                                        >
                                            Mark all read
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="
                      text-[11px]
                      text-[#91A0B0]
                      hover:text-[#D98A83]
                      transition-colors
                    "
                                    >
                                        Clear all
                                    </button>

                                </div>
                            </div>
                        )}

                        {/* Notification list */}

                        <div className="
              max-h-[390px]
              overflow-y-auto
              divide-y divide-[#252A2D]
              notification-scrollbar
            ">

                            <AnimatePresence initial={false}>
                                {notifications.map((notification) => {
                                    const Icon =
                                        notificationIcons[notification.type] ||
                                        HiOutlineBell;

                                    const color =
                                        notificationColors[notification.type] ||
                                        'text-[#91A0B0] bg-white/[0.05]';

                                    return (
                                        <motion.div
                                            key={notification.id}
                                            layout
                                            initial={{
                                                opacity: 0,
                                                height: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                height: 'auto',
                                            }}
                                            exit={{
                                                opacity: 0,
                                                height: 0,
                                                transition: {
                                                    duration: 0.17,
                                                },
                                            }}
                                            transition={{
                                                layout: {
                                                    duration: 0.2,
                                                    ease: 'easeInOut',
                                                },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="
                        group relative
                        px-4 py-4
                        flex gap-3
                        hover:bg-white/[0.018]
                        transition-colors duration-150
                      ">

                                                {/* Type icon */}

                                                <div className={`
                          w-9 h-9 shrink-0
                          flex items-center justify-center
                          rounded-md
                          ${color}
                        `}>
                                                    <Icon className="w-[18px] h-[18px]" />
                                                </div>

                                                {/* Content */}

                                                <div className="flex-1 min-w-0">

                                                    <div className="
                            flex items-start justify-between
                            gap-2
                          ">
                                                        <div className="flex items-center gap-1.5 min-w-0">

                                                            <h4 className="
                                text-[12px]
                                font-semibold
                                text-[#EAE9E6]
                                leading-5
                              ">
                                                                {notification.title}
                                                            </h4>

                                                            {notification.unread && (
                                                                <span className="
                                  w-1.5 h-1.5 shrink-0
                                  rounded-full
                                  bg-[#E3AD35]
                                " />
                                                            )}

                                                        </div>

                                                        {/* Individual dismiss */}

                                                        <button
                                                            type="button"
                                                            aria-label="Dismiss notification"
                                                            onClick={() =>
                                                                removeNotification(notification.id)
                                                            }
                                                            className="
                                opacity-0
                                group-hover:opacity-100
                                focus:opacity-100
                                shrink-0
                                p-1 rounded
                                text-[#718196]
                                hover:text-[#E58A82]
                                hover:bg-white/[0.05]
                                transition-all duration-150
                              "
                                                        >
                                                            <HiOutlineXMark className="w-3.5 h-3.5" />
                                                        </button>

                                                    </div>

                                                    <p className="
                            text-[11px]
                            leading-[1.6]
                            text-[#8294A8]
                            mt-1 pr-2
                          ">
                                                        {notification.message}
                                                    </p>

                                                    <div className="
                            flex items-center
                            justify-between gap-2
                            mt-3
                          ">
                                                        <span className="
                              text-[10px]
                              text-[#647386]
                            ">
                                                            {notification.time}
                                                        </span>

                                                        {notification.actionLabel && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleAction(notification)
                                                                }
                                                                className="
                                  flex items-center gap-1
                                  text-[11px]
                                  font-medium
                                  text-[#E3AD35]
                                  hover:text-[#F0C45E]
                                  transition-colors
                                "
                                                            >
                                                                {notification.actionLabel}

                                                                <HiOutlineArrowUpRight
                                                                    className="w-3 h-3"
                                                                />
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>

                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Empty state */}

                            {notifications.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="
                    py-12 px-5
                    flex flex-col items-center
                    text-center
                  "
                                >
                                    <div className="
                    w-11 h-11
                    rounded-full
                    bg-white/[0.035]
                    border border-[#292D30]
                    flex items-center justify-center
                    mb-3
                  ">
                                        <HiOutlineCheckCircle className="
                      w-5 h-5 text-[#8294A8]
                    " />
                                    </div>

                                    <p className="
                    text-[13px]
                    font-medium
                    text-[#EAE9E6]
                  ">
                                        You're all caught up
                                    </p>

                                    <p className="
                    text-[11px]
                    text-[#718196]
                    mt-1
                  ">
                                        New learning updates will appear here.
                                    </p>
                                </motion.div>
                            )}

                        </div>

                        {/* Footer */}

                        {/* {notifications.length > 0 && (
                            <div className="
                px-4 py-3
                border-t border-[#292D30]
                flex items-center justify-between
              ">
                                <span className="
                  text-[10px] text-[#718196]
                ">
                                    {notifications.length} notifications
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        navigate('/analytics');
                                    }}
                                    className="
                    flex items-center gap-1
                    text-[11px]
                    text-[#E3AD35]
                    hover:text-[#F0C45E]
                    transition-colors
                  "
                                >
                                    View activity
                                    <HiOutlineArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>
                        )} */}

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
