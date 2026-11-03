
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useThemeStore } from '../store/themeStore.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineXMark,
  HiEllipsisHorizontal,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlinePlus,
  HiOutlineUserCircle,
  HiOutlineChevronDown,
  HiOutlineCheck,
} from 'react-icons/hi2';
import NotificationDropdown from './NotificationDropdown.jsx';
import MobileMenu from './MobileMenu.jsx';

const GOLD = '#E3AD35';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [hideLocation, setHideLocation] = useState(false)
  useEffect(() => {
    const currentLocation = location.pathname
    console.log(currentLocation.includes("/notebook") || currentLocation.includes("/quiz"))
    if (currentLocation.includes("/notebook") || currentLocation.includes("/quiz")) {
      setHideLocation(true)
    } else {
      setHideLocation(false)
    }
  }, [location])
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const isDark = theme === 'dark';

  const initials = user?.name
    ? user.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : '?';

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `http://localhost:5000${user.avatar}`
    : '/student.png';

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      scale: 0.99,
      transition: {
        duration: 0.13,
        ease: 'easeIn',
      },
    },
  };

  const menuItem =
    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] text-[#A0ADBA] hover:text-[#F0EFEC] hover:bg-white/[0.045] transition-colors duration-150';


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (<>

    <header
      className={`
        sticky top-0 z-[200]
        h-[66px] w-full shrink-0
         items-center justify-between
        px-0 sm:px-2 lg:px-8
        bg-[#0B0D0E]/95
        border-b border-[#202426]
        backdrop-blur-xl
        ${hideLocation ? "hidden lg:flex" : "flex"}
      `}
      style={{
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* LEFT: SEARCH */}

      <div className="flex items-center flex-1 min-w-0 max-w-[520px]">
        <button
          onClick={toggleMenu}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl
                       text-gray-600 transition-colors hover:bg-gray-100
                       dark:text-gray-300 dark:hover:bg-white/10"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen
            ? <HiOutlineXMark size={22} />
            : <img src="/icon.png" alt="" className="h-8 w-8 object-contain" />
          }
        </button>
        <div className="
          block md:hidden
          w-px h-6 mx-3
          bg-[#292D30] mx-1
        " />

        <div className="relative w-full hidden sm:block group">

          <HiOutlineMagnifyingGlass
            className="
              absolute left-3.5 top-1/2
              -translate-y-1/2
              w-[17px] h-[17px]
              text-[#718196]
              group-focus-within:text-[#E3AD35]
              transition-colors duration-150
            "
          />

          <input
            type="search"
            placeholder="Search documents, quizzes..."
            aria-label="Search documents and quizzes"
            className="
              w-full py-4
              pl-10 pr-14
              rounded-md
              bg-[#111415]
              border border[#252A2D] border-[#111415]
              text-[#EAE9E6]
              placeholder:text-[#657386]
              text-[12px]
              outline-none
              focus:border-[#E3AD35]/40
              focus:ring-1 focus:ring-[#E3AD35]/10
              transition-all duration-200
            "
          />

          <div className="
            absolute right-3 top-1/2
            -translate-y-1/2
            hidden md:flex items-center gap-1
            px-1.5 py-1
            rounded border border-[#303538]
            bg-[#181B1D]
          ">
            <span className="text-[10px] text-[#8795A4]">
              Ctrl
            </span>
            <span className="text-[10px] text-[#8795A4]">
              K
            </span>
          </div>
        </div>

        {/* Mobile search icon */}

        <button
          type="button"
          aria-label="Search"
          className="
            sm:hidden w-9 h-9
            flex items-center justify-center
            rounded-md text-[#91A0B0]
            hover:text-[#E3AD35]
            hover:bg-white/[0.04]
            transition-colors
          "
        >
          <HiOutlineMagnifyingGlass className="w-5 h-5" />
        </button>
      </div>

      {/* RIGHT: ACTIONS */}

      <div className="flex items-center gap-2 sm:gap-3 ml-3">

        {/* Upload */}

        <button
          type="button"
          onClick={() => navigate('/documents')}
          className="
            h-[36px] px-3 sm:px-3.5
            flex items-center justify-center gap-2
            rounded-md
            bg-[#E3AD35]
            text-[#11100C]
            hover:bg-[#EDBB4F]
            active:scale-[0.98]
            transition-all duration-150
            text-[12px] font-semibold
          "
        >
          <HiOutlinePlus className="w-4 h-4" />

          <span className="hidden sm:inline">
            Upload
          </span>
        </button>

        {/* Divider */}

        <div className="
          hidden sm:block
          w-px h-6
          bg-[#292D30] mx-1
        " />

        {/* Notifications */}
        <NotificationDropdown />

        {/* Divider */}

        <div className="
          w-px h-6
          bg-[#292D30] mx-1
        " />

        {/* PROFILE CONTAINER */}

        <div ref={profileRef} className="relative">

          {/* Profile Trigger */}

          <button
            type="button"
            aria-label="Open account menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            onClick={() => setProfileOpen(prev => !prev)}
            className={`
              flex items-center gap-2 sm:gap-2.5
              py-1.5 px-1.5 sm:px-2
              rounded-md
              transition-colors duration-150
              ${profileOpen
                ? 'bg-white/[0.055]'
                : 'hover:bg-white/[0.035]'
              }
            `}
          >
            {/* Avatar */}

            <div className="relative shrink-0">

              <img
                src={avatarUrl}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/student.png';
                }}
                className="
                  w-[34px] h-[34px]
                  rounded-full object-cover
                  border border-[#343A3D]
                "
              />

              <span className="
                absolute bottom-0 right-0
                w-[9px] h-[9px]
                rounded-full
                bg-[#43B987]
                border-2 border-[#0B0D0E]
              " />
            </div>

            {/* User details */}

            <div className="hidden sm:block text-left min-w-0">

              <p className="
                text-[12px] font-semibold
                text-[#F0EFEC]
                leading-tight
                max-w-[120px] truncate
                capitalize
              ">
                {user?.name || 'User'}
              </p>

              <p className="
                text-[10px]
                text-[#8294A8]
                mt-1
                leading-none
              ">
                {user?.role === 'admin'
                  ? 'Premium Member'
                  : 'Study Plan'}
              </p>
            </div>

            <motion.div
              animate={{
                rotate: profileOpen ? 180 : 0,
              }}
              transition={{ duration: 0.18 }}
              className="hidden sm:block"
            >
              <HiOutlineChevronDown className="
                w-3.5 h-3.5
                text-[#718196]
              " />
            </motion.div>
          </button>

          {/* ACCOUNT DROPDOWN */}

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="menu"
                className="
                  absolute right-0 top-[calc(100%+12px)]
                  w-[250px]
                  rounded-lg
                  bg-[#111415]
                  border border-[#303538]
                  shadow-[0_12px_40px_rgba(0,0,0,0.45)]
                  p-2
                  z-[100]
                  origin-top-right
                "
              >

                {/* ACCOUNT IDENTITY */}

                <div className="
                  flex items-center gap-3
                  px-2.5 py-3
                ">
                  <img
                    src={avatarUrl}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = '/student.png';
                    }}
                    className="
                      w-9 h-9 rounded-full
                      object-cover
                      border border-[#343A3D]
                    "
                  />

                  <div className="min-w-0 flex-1">

                    <p className="
                      text-[13px] font-semibold
                      text-[#F0EFEC]
                      truncate
                    ">
                      {user?.name || 'User'}
                    </p>

                    <p className="
                      text-[10px] text-[#8294A8]
                      mt-0.5 truncate
                    ">
                      {user?.email || 'Your account'}
                    </p>

                  </div>
                </div>

                <div className="h-px bg-[#292D30] my-1.5" />

                {/* PROFILE */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/profile');
                  }}
                  className={menuItem}
                >
                  <HiOutlineUserCircle className="w-[18px] h-[18px]" />

                  <span className="flex-1 text-left">
                    My Profile
                  </span>
                </button>

                {/* DARK THEME */}

                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={isDark}
                  onClick={toggleTheme}
                  className={menuItem}
                >
                  {isDark ? (
                    <HiOutlineMoon className="w-[18px] h-[18px]" />
                  ) : (
                    <HiOutlineSun className="w-[18px] h-[18px]" />
                  )}

                  <span className="flex-1 text-left">
                    Dark theme
                  </span>

                  {isDark && (
                    <HiOutlineCheck
                      className="w-4 h-4 text-[#E3AD35]"
                    />
                  )}
                </button>

                <div className="h-px bg-[#292D30] my-1.5" />

                {/* LOGOUT */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-3
                    px-3 py-2.5 rounded-md
                    text-[13px]
                    text-[#C47D78]
                    hover:text-[#EF918A]
                    hover:bg-[#D45C52]/[0.08]
                    transition-colors duration-150
                  "
                >
                  <HiOutlineArrowRightOnRectangle
                    className="w-[18px] h-[18px]"
                  />

                  <span>Log out</span>
                </button>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </header>
    <MobileMenu
      isOpen={isMenuOpen}
      onClose={closeMenu}
    />
  </>
  );
}

// import { useAuthStore } from '../store/authStore.js';
// import { useThemeStore } from '../store/themeStore.js';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   HiOutlineArrowRightOnRectangle,
//   HiOutlineMagnifyingGlass,
//   HiOutlineBell,
//   HiOutlineMoon,
//   HiOutlineSun,
//   HiOutlinePlus,
//   HiOutlineCommandLine
// } from 'react-icons/hi2';

// export default function Navbar() {
//   const { user, logout } = useAuthStore();
//   const { theme, toggleTheme } = useThemeStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const initials = user?.name
//     ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
//     : '?';

//   return (
//     <header className="
//       h-16 flex-shrink-0 flex items-center justify-between px-6
//       bg-[var(--bg-navbar)] backdrop-blur-xl 
//       sticky top-0 z-40 transition-colors duration-300
//     ">
//       {/* Left Section — Search & Quick Actions */}
//       <div className="flex items-center gap-6 flex-1 max-w-xl">
//         <div className="relative group w-full hidden md:block">
//           <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-primary-500 transition-colors" />
//           <input
//             type="text"
//             placeholder="Search documents, quizzes..."
//             className="
//               w-full pl-11 pr-4 py-2 rounded-xl text-sm
//               bg-[var(--bg-card)] border border-[var(--border-main)]
//               text-[var(--text-main)] placeholder-[var(--text-muted)]
//               focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50
//               transition-all duration-200
//             "
//           />
//           <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 px-1.5 py-1 rounded-md bg-white/5 border border-white/5">
//             <HiOutlineCommandLine className="w-3 h-3 text-[var(--text-muted)]" />
//             <span className="text-[10px] font-bold text-[var(--text-muted)]">K</span>
//           </div>
//         </div>
//       </div>

//       {/* Right Section — Tools, Theme, Profile */}
//       <div className="flex items-center gap-3">
//         {/* Quick Action Button */}
//         <button
//           onClick={() => navigate('/documents')}
//           className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5842EA] text-white text-sm font-bold hover:bg-primary-500 transition-all hover:scale-[1.02] active:scale-95"
//         >
//           <HiOutlinePlus className="w-4 h-4" />
//           <span>Upload</span>
//         </button>

//         <div className="w-px h-6 bg-[var(--border-main)] mx-2 hidden sm:block" />

//         {/* Theme Toggle */}
//         <button
//           onClick={toggleTheme}
//           className="
//             w-10 h-10 flex items-center justify-center rounded-xl
//             text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-500/10
//             transition-all duration-200 relative overflow-hidden
//           "
//         >
//           <AnimatePresence mode="wait">
//             {theme === 'dark' ? (
//               <motion.div key="moon" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
//                 <HiOutlineMoon className="w-5 h-5" />
//               </motion.div>
//             ) : (
//               <motion.div key="sun" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
//                 <HiOutlineSun className="w-5 h-5" />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </button>

//         {/* Notifications */}
//         <button className="
//           w-10 h-10 flex items-center justify-center rounded-xl
//           text-[var(--text-muted)] hover:text-primary-500 hover:bg-primary-500/10
//           transition-all duration-200 relative
//         ">
//           <HiOutlineBell className="w-5 h-5" />
//           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-[var(--bg-navbar)]"></span>
//         </button>
//         <div className="border-l border-[var(--border-main)] h-6.5"></div>

//         {/* Profile Dropdown */}
//         <div
//           onClick={() => navigate('/profile')}
//           className="flex items-center gap-3 ml-2 px-3 transition duration-200 group cursor-pointer hover:bg-white/10 py-2 rounded"
//         >
//           <div className="text-right hidden lg:block">
//             <p className="text-xs font-bold text-[var(--text-main)] leading-none">{user?.name}</p>
//             <p className="text-[10px] font-medium text-[var(--text-muted)] mt-1">{user?.role === 'admin' ? 'Premium Member' : 'Study Plan'}</p>
//           </div>
//           <div className="relative">
//             {user?.avatar ? (
//               <img src={`http://localhost:5000${user.avatar}`} alt="" className='w-8 h-8 rounded-full object-cover border border-[var(--border-main)]' />
//             ) : (
//               <img src="/student.png" alt="" className='w-8 h-8 rounded-full object-cover border border-[var(--border-main)]' />
//             )}
//             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg-navbar)]"></div>
//           </div>
//         </div>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           title="Logout"
//           className="
//             ml-1 w-10 h-10 flex items-center justify-center rounded-xl
//             text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10
//             transition-all duration-200 active:scale-90
//           "
//         >
//           <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
//         </button>
//       </div>
//     </header>
//   );
// }


// import { useAuthStore } from '../store/authStore.js';
// import { useNavigate } from 'react-router-dom';
// import { HiOutlineArrowRightOnRectangle, HiOutlineUser } from 'react-icons/hi2';

// export default function Navbar() {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header className="h-16 border-b border-white/5 bg-surface-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
//       <div />
//       <div className="flex items-center gap-4">
//         {/* Points badge */}
//         <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/20">
//           <span className="text-xs font-semibold text-primary-400">⚡ {user?.points || 0} pts</span>
//         </div>

//         {/* User info */}
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
//             <HiOutlineUser className="w-4 h-4 text-white" />
//           </div>
//           <span className="text-sm font-medium text-surface-300 hidden sm:block">{user?.name}</span>
//         </div>

//         <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/5 text-surface-400 hover:text-danger transition-colors" title="Logout">
//           <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
//         </button>
//       </div>
//     </header>
//   );
// }
