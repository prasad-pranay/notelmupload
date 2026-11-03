import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore.js';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';

import {
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlinePuzzlePiece,
  HiOutlineChartBar,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineBookOpen,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const sections = [
  {
    label: 'OVERVIEW',
    items: [{ path: '/', icon: HiOutlineHome, label: 'Dashboard' }],
  },
  {
    label: 'STUDY',
    items: [
      { path: '/notebook', icon: HiOutlineBookOpen, label: 'Notebook' },
      { path: '/solve', icon: HiOutlineSparkles, label: 'Solver' },
    ],
  },
  {
    label: 'LIBRARY',
    items: [
      {
        path: '/documents',
        icon: HiOutlineDocumentText,
        label: 'Documents',
        hasChildren: true,
      },
      { path: '/quizzes', icon: HiOutlinePuzzlePiece, label: 'Quizzes' },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [{ path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' }],
  },
];

function DocumentItems({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then((response) => response.data.data),
  });

  return (
    <div className={`document-reveal ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="ml-[21px] mb-1 mt-1 space-y-0.5 border-l border-white/[0.09] pl-3">
        {data.map((doc) => {
          const active = location.pathname.includes(doc._id);
          return (
            <button
              key={doc._id}
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className={`group flex w-full min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12px] transition-[color,background-color] duration-150 ${active
                ? 'bg-[#E3AD35]/[0.07] text-[#E9C16B]'
                : 'text-[#87919A] hover:bg-white/[0.035] hover:text-[#F0EFEC]'
                }`}
            >
              <HiOutlineDocumentText className="h-3.5 w-3.5 shrink-0 opacity-70" />
              <span className="truncate">{doc.title}</span>
              {active && <span className="ml-auto h-1 w-1 shrink-0 rounded-full bg-[#E3AD35]" />}
            </button>
          );
        })}
        {data.length === 0 && (
          <p className="px-2.5 py-2 text-[11px] text-[#68737D]">No documents yet</p>
        )}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const [showDocuments, setShowDocuments] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/documents')) setShowDocuments(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) setShowDocuments(false);
  }, [sidebarOpen]);

  return (
    <aside
      className={`notelm-sidebar hidden md:flex fixed left-0 top-0 z-[150] h-screen shrink-0 flex-col overflow-visible ${sidebarOpen ? 'is-expanded' : 'is-collapsed'
        }`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <style>{`
        .notelm-sidebar {
          width: 76px;
          color: #EDECE7;
          background: #0C0F10;
          border-right: 1px solid rgba(255,255,255,.075);
          box-shadow: 8px 0 28px rgba(0,0,0,.13);
          transition: width 160ms cubic-bezier(.2,.75,.25,1);
          will-change: width;
        }
        .notelm-sidebar.is-expanded { width: 258px; }
        .notelm-sidebar .sidebar-label,
        .notelm-sidebar .section-label,
        .notelm-sidebar .brand-copy,
        .notelm-sidebar .collapse-copy {
          transition: opacity 110ms ease, transform 110ms ease;
        }
        .notelm-sidebar.is-collapsed .sidebar-label,
        .notelm-sidebar.is-collapsed .section-label,
        .notelm-sidebar.is-collapsed .collapse-copy {
          display: none;
        }
        .notelm-sidebar.is-collapsed .brand-copy {
          opacity: 0;
          transform: translateX(-4px);
          pointer-events: none;
        }
        .notelm-sidebar .document-reveal {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows 150ms ease, opacity 120ms ease;
          overflow: hidden;
        }
        .notelm-sidebar .document-reveal > div { min-height: 0; overflow: hidden; }
        .notelm-sidebar .document-reveal.is-open { grid-template-rows: 1fr; opacity: 1; }
        .notelm-sidebar .nav-link { transition: background-color 130ms ease, color 130ms ease; }
        .notelm-sidebar .nav-link:focus-visible,
        .notelm-sidebar button:focus-visible { outline: 2px solid rgba(227,173,53,.65); outline-offset: 2px; }
        .notelm-sidebar .nav-icon { transition: color 130ms ease; }
        .notelm-sidebar .nav-link:not(.active):hover .nav-icon { color: #D9B96E; }
        .notelm-sidebar .nav-tooltip {
          opacity: 0; transform: translate(4px,-50%);
          transition: opacity 120ms ease, transform 120ms ease;
        }
        .notelm-sidebar.is-collapsed .nav-item:hover .nav-tooltip,
        .notelm-sidebar.is-collapsed .nav-item:focus-within .nav-tooltip {
          opacity: 1; transform: translate(0,-50%);
        }
        @media (prefers-reduced-motion: reduce) {
          .notelm-sidebar, .notelm-sidebar * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Brand */}
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="NoteLM home"
        className={`relative flex h-[66px] shrink-0 items-center border-b border-white/[0.075] text-left transition-colors duration-150 hover:bg-white/[0.018] ${sidebarOpen ? 'gap-3.5 px-[18px]' : 'justify-center'
          }`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]  bg-[#15191A] shadow-[0_3px_12px_rgba(0,0,0,.22)]">
          <img src="/icon.png" alt="" className="h-8 w-8 object-contain" />
        </span>
        <span className="brand-copy absolute left-[70px] min-w-0 whitespace-nowrap">
          <span className="block text-[17px] font-semibold leading-5 tracking-[-0.045em] text-[#F1F0EC]">NoteLM</span>
          {/* <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.18em] text-[#78848D]">Your learning space</span> */}
        </span>
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-5 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Main navigation">
        {sections.map((section, sectionIndex) => (
          <div key={section.label} className={sectionIndex === 0 ? '' : 'mt-[22px]'}>
            <div className="section-label mb-2 h-3 overflow-hidden px-3 text-[9px] font-semibold tracking-[0.19em] text-[#65717A]">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map(({ path, icon: Icon, label, hasChildren }) => (
                <div key={path} className="nav-item relative">
                  <NavLink
                    to={path}
                    end={path === '/'}
                    className={({ isActive }) =>
                      `nav-link group relative flex h-[43px] items-center rounded-[10px] ${sidebarOpen ? 'gap-3 px-3.5' : 'justify-center'
                      } ${isActive ? 'active bg-[#E3AD35]/[0.085] text-[#F1EEE6]' : 'text-[#89949D] hover:bg-white/[0.035] hover:text-[#F0EFEC]'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute bottom-[10px] left-0 top-[10px] w-[2px] rounded-r-full bg-[#E3AD35]" />}
                        <Icon className={`nav-icon relative z-10 h-[19px] w-[19px] shrink-0 ${isActive ? 'text-[#E3AD35]' : ''}`} strokeWidth={isActive ? 1.9 : 1.65} />
                        <span className="sidebar-label relative z-10 min-w-0 flex-1 truncate whitespace-nowrap text-[12.5px] font-medium tracking-[0.005em]">{label}</span>
                      </>
                    )}
                  </NavLink>

                  {hasChildren && sidebarOpen && (
                    <button
                      type="button"
                      aria-label="Toggle documents"
                      aria-expanded={showDocuments}
                      onClick={() => setShowDocuments((value) => !value)}
                      className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-md p-1.5 text-[#71808A] transition-colors duration-150 hover:bg-white/[0.055] hover:text-[#E3AD35]"
                    >
                      <HiOutlineChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${showDocuments ? 'rotate-180' : ''}`} />
                    </button>
                  )}

                  {!sidebarOpen && (
                    <span className="nav-tooltip pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[200] whitespace-nowrap rounded-md border border-white/[0.1] bg-[#191E20] px-3 py-2 text-[11px] font-medium text-[#F0EFEC] shadow-xl">
                      {label}
                    </span>
                  )}

                  {hasChildren && <DocumentItems open={sidebarOpen && showDocuments} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.075] p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className={`flex h-[42px] w-full items-center rounded-[10px] border border-white/[0.065] bg-white/[0.018] text-[#89949D] transition-[background-color,color,border-color] duration-150 hover:border-[#E3AD35]/[0.18] hover:bg-[#E3AD35]/[0.045] hover:text-[#E8C16D] active:scale-[0.99] ${sidebarOpen ? 'gap-3 px-3.5' : 'justify-center'
            }`}
        >
          <HiOutlineChevronLeft className={`h-[18px] w-[18px] shrink-0 transition-transform duration-150 ${sidebarOpen ? '' : 'rotate-180'}`} />
          <span className="collapse-copy whitespace-nowrap text-[11px] font-medium">Collapse sidebar</span>
        </button>
      </div>
    </aside>
  );
}


// import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import { useAppStore } from '../store/appStore.js';
// import {
//   HiOutlineHome,
//   HiOutlineDocumentText,
//   HiOutlinePuzzlePiece,
//   HiOutlineGlobeAlt,
//   HiOutlineChartBar,
//   HiOutlineChevronLeft,
//   HiOutlineChevronRight,
//   HiOutlineBookOpen,
//   HiOutlineSparkles,
// } from 'react-icons/hi2';

// import { useQuery } from '@tanstack/react-query';
// import api from '../api/axios.js';
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const FileIcon = () => (
//   <svg className='size-3.5' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
//     <path fill="#e2e5e7" d="M128 0c-17.6 0-32 14.4-32 32v448c0 17.6 14.4 32 32 32h320c17.6 0 32-14.4 32-32V128L352 0z" />
//     <path fill="#b0b7bd" d="M384 128h96L352 0v96c0 17.6 14.4 32 32 32" />
//     <path fill="#f15642" d="M416 416c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V256c0-8.8 7.2-16 16-16h352c8.8 0 16 256c0 8.8-7.2 16-16 16z" />
//   </svg>
// );

// const DocumentItems = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { data } = useQuery({
//     queryKey: ['documents'],
//     queryFn: () => api.get('/documents').then((r) => r.data.data),
//   });

//   return (
//     <div className='flex flex-col ml-9 mt-1 space-y-1 mb-2 border-l border-[var(--border-main)]'>
//       {data?.map((doc, index) => (
//         <motion.div
//           key={doc._id}
//           initial={{ x: -10, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.2, delay: index * 0.05 }}
//           onClick={() => navigate(`/documents/${doc._id}`)}
//           className={`
//             group flex items-center px-3 py-2 rounded-r-lg cursor-pointer transition-all
//             ${location.pathname.includes(doc._id)
//               ? 'bg-primary-500/10 text-primary-500 font-bold border-l-2 border-primary-500 -ml-[1px]'
//               : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]'}
//           `}
//         >
//           <span className="text-[11px] truncate max-w-[140px]">{doc.title}</span>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// const navItems = [
//   { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
//   { path: '/notebook', icon: HiOutlineBookOpen, label: 'Notebook' },
//   { path: '/solve', icon: HiOutlineSparkles, label: 'Solver' },
//   { path: '/documents', icon: HiOutlineDocumentText, label: 'Documents', hasChildren: true },
//   { path: '/quizzes', icon: HiOutlinePuzzlePiece, label: 'Quizzes' },
//   { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
// ];

// export default function Sidebar() {
//   const { sidebarOpen, toggleSidebar } = useAppStore();
//   const [showDocuments, setShowDocuments] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();

//   return (
//     <aside
//       className={`
//         fixed left-0 top-0 h-full z-50 flex flex-col
//         bg-[var(--bg-sidebar)]
//         transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
//         ${sidebarOpen ? 'w-64' : 'w-20'}
//       `}
//     >
//       {/* Brand Logo */}
//       <div onClick={() => navigate("/")} className={`
//         flex items-center h-16 flex-shrink-0 cursor-pointer
//         ${sidebarOpen ? 'px-6 gap-3' : 'justify-center'}
//       `}>
//         <div className="w-10 h-10 rounded-sm bg-[#0D1018] flex items-center justify-center border border-[var(--border-main)] shrink-0">
//           <img src="/icon.png" alt="NoteLM" className="w-8 h-8" />
//         </div>
//         <AnimatePresence>
//           {sidebarOpen && (
//             <motion.span
//               initial={{ opacity: 0, scaleX: 0 }}
//               animate={{ opacity: 1, scaleX: 1 }}
//               exit={{ opacity: 0, scaleX: 0 }}
//               className="text-lg font-black text-[var(--text-main)] tracking-tight"
//             >
//               NoteLM
//             </motion.span>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 py-6 px-3 space-y-1">
//         {navItems.map(({ path, icon: Icon, label, hasChildren }) => (
//           <div key={path}>
//             <NavLink
//               to={path}
//               end={path === '/'}
//               className={({ isActive }) => `
//                 group relative flex active:scale-80 items-center py-3.5 rounded-2xl transition duration-200 z-10
//                 ${sidebarOpen ? 'px-4 gap-3' : 'justify-center'}
//                 ${isActive ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}
//               `}
//             >
//               {({ isActive }) => (
//                 <>
//                   {isActive && (
//                     <motion.div
//                       layoutId="sidebarActiveTab"
//                       className="absolute inset-0 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/20 -z-10"
//                       initial={false}
//                       transition={{ type: "spring", stiffness: 350, damping: 30 }}
//                     />
//                   )}
//                   {!isActive && (
//                     <div className="absolute inset-0 rounded-2xl bg-transparent group-hover:bg-[var(--glass-bg)] transition-colors duration-200 -z-10" />
//                   )}

//                   <Icon className={`relative z-10 w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${sidebarOpen ? '' : 'mx-auto'}`} />
//                   <AnimatePresence>
//                     {sidebarOpen && (
//                       <motion.div className="relative z-10 flex-1 flex items-center justify-between" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} exit={{ opacity: 0, scaleX: 0 }}>
//                         <span className="text-sm font-bold tracking-tight">{label}</span>
//                         {hasChildren && (
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault();
//                               setShowDocuments(!showDocuments);
//                             }}
//                             className={`p-1 rounded-lg hover:bg-white/10 transition-transform duration-200 ${showDocuments ? 'rotate-180' : ''}`}
//                           >
//                             <HiOutlineChevronLeft className="-rotate-90 w-3 h-3" />
//                           </button>
//                         )}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>

//                   {!sidebarOpen && (
//                     <div className="
//                       absolute left-[120%] ml-4 px-3 py-2 bg-[var(--bg-sidebar)] border border-[var(--border-main)] 
//                       text-[var(--text-main)] text-xs font-bold rounded-xl shadow-2xl opacity-0 
//                       group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 
//                       pointer-events-none transition-all duration-200 z-50 
//                     ">
//                       {label}
//                     </div>
//                   )}
//                 </>
//               )}
//             </NavLink>

//             {sidebarOpen && hasChildren && showDocuments && <DocumentItems />}
//           </div>
//         ))}
//       </nav>

//       {/* Footer / User Profile Summary */}
//       <div className="p-4">
//         <button
//           onClick={toggleSidebar}
//           className={`
//             w-full flex items-center py-3 rounded-2xl transition-all
//             border border-[var(--border-main)]
//             bg-[#0F151F]
//             text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)]
//             ${sidebarOpen ? 'px-4 gap-3' : 'justify-center'}
//           `}
//         >
//           {sidebarOpen ? (
//             <>
//               <HiOutlineChevronLeft className="w-5 h-5" />
//               <span className="text-xs font-bold uppercase tracking-widest">Collapse</span>
//             </>
//           ) : (
//             <HiOutlineChevronRight className="w-5 h-5" />
//           )}
//         </button>
//       </div>
//     </aside>
//   );
// }


// const navItems = [
//   { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
//   { path: '/documents', icon: HiOutlineDocumentText, label: 'Documents' },
//   { path: '/quizzes', icon: HiOutlinePuzzlePiece, label: 'My Quizzes' },
//   { path: '/explore', icon: HiOutlineGlobeAlt, label: 'Explore' },
//   { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
// ];

// export default function Sidebar() {
//   const { sidebarOpen, toggleSidebar } = useAppStore();

//   return (
//     <aside className={`fixed left-0 top-0 h-full bg-surface-900/80 backdrop-blur-xl border-r border-white/5 z-30 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}>
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
//         <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">N</div>
//         {sidebarOpen && <span className="text-lg font-bold gradient-text">NoteLM</span>}
//       </div>

//       {/* Nav items */}
//       <nav className="flex-1 py-4 space-y-1 px-2">
//         {navItems.map(({ path, icon: Icon, label }) => (
//           <NavLink
//             key={path}
//             to={path}
//             end={path === '/'}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
//               ${isActive ? 'bg-primary-600/20 text-primary-400' : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'}`
//             }
//           >
//             <Icon className="w-5 h-5 shrink-0" />
//             {sidebarOpen && <span>{label}</span>}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Collapse button */}
//       <button
//         onClick={toggleSidebar}
//         className="flex items-center justify-center h-12 border-t border-white/5 text-surface-400 hover:text-surface-200 transition-colors"
//       >
//         {sidebarOpen ? <HiOutlineChevronLeft className="w-5 h-5" /> : <HiOutlineChevronRight className="w-5 h-5" />}
//       </button>
//     </aside>
//   );
