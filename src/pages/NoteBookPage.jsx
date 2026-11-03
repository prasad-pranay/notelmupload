
import React, { useEffect, useState } from 'react'

import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from 'react-resizable-panels'

import { useNavigate } from 'react-router-dom'

import {
  HiOutlineArrowLeft,
  HiOutlineFolderOpen,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2'

import NoteChat from '../notebook/NoteChat'
import NoteContentShow from '../notebook/NoteContentShow'
import NoteLeftUpload from '../notebook/NoteLeftUpload'

import { useNotebookStore } from '../store/notebookStore'


const NoteBookPage = () => {
  const navigate = useNavigate()

  const {
    fetchOrCreateDefaultNotebook,
    isLoading,
    notebook,
  } = useNotebookStore()

  const [activeTab, setActiveTab] = useState('sources')

  // Detect Tailwind md breakpoint
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 1080px)').matches
  )

  useEffect(() => {
    fetchOrCreateDefaultNotebook()
  }, [fetchOrCreateDefaultNotebook])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1080px)')

    const handleResize = (e) => {
      setIsDesktop(e.matches)
    }

    setIsDesktop(mediaQuery.matches)

    mediaQuery.addEventListener('change', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
  }, [])


  // ------------------------------------------
  // MOBILE TABS
  // ------------------------------------------

  const tabs = [
    {
      id: 'sources',
      label: 'Sources',
      icon: HiOutlineFolderOpen,
    },
    {
      id: 'reader',
      label: 'Reader',
      icon: HiOutlineDocumentText,
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: HiOutlineChatBubbleLeftRight,
    },
  ]


  // ------------------------------------------
  // LOADING
  // ------------------------------------------

  if (isLoading && !notebook) {
    return (
      <div className="
        h-full w-full
        flex flex-col
        items-center justify-center
        gap-4
        bg-[#0b0d0e]
      ">
        <div className="
          w-10 h-10
          rounded-full
          border-[3px]
          border-[#eab42e]
          border-t-transparent
          animate-spin
        " />

        <p className="
          text-xs font-medium
          text-[#84909a]
        ">
          Initializing workspace...
        </p>
      </div>
    )
  }


  // ------------------------------------------
  // DESKTOP LAYOUT
  // ------------------------------------------

  if (isDesktop) {
    return (
      <div className="
        h-full w-full
        overflow-hidden
        bg-[#0b0d0e]
      ">

        <PanelGroup
          direction="horizontal"
          className="h-full w-full"
        >

          {/* SOURCES PANEL */}

          <Panel
            defaultSize={30}
            minSize={15}
            className="h-full min-w-0"
          >
            <NoteLeftUpload />
          </Panel>


          {/* RESIZE HANDLE */}

          <PanelResizeHandle
            className="
              w-1.5 shrink-0
              group relative
              flex items-center justify-center
              border-none outline-none
              bg-transparent
              hover:bg-[#eab42e]/[0.04]
              transition-colors
            "
          >
            <div className="
              w-1 h-7
              rounded-full
              bg-[#303638]
              group-hover:bg-[#eab42e]/60
              group-active:bg-[#eab42e]
              transition-colors
            " />
          </PanelResizeHandle>


          {/* READER PANEL */}

          <Panel
            defaultSize={36}
            minSize={20}
            className="h-full min-w-0"
          >
            <NoteContentShow />
          </Panel>


          {/* RESIZE HANDLE */}

          <PanelResizeHandle
            className="
              w-1.5 shrink-0
              group relative
              flex items-center justify-center
              border-none outline-none
              bg-transparent
              hover:bg-[#eab42e]/[0.04]
              transition-colors
            "
          >
            <div className="
              w-1 h-7
              rounded-full
              bg-[#303638]
              group-hover:bg-[#eab42e]/60
              group-active:bg-[#eab42e]
              transition-colors
            " />
          </PanelResizeHandle>


          {/* AI CHAT PANEL */}

          <Panel
            defaultSize={34}
            minSize={20}
            className="h-full min-w-0"
          >
            <NoteChat />
          </Panel>

        </PanelGroup>

      </div>
    )
  }


  // ------------------------------------------
  // MOBILE LAYOUT
  // ------------------------------------------

  return (
    <div className="
      h-full w-full
      flex flex-col
      overflow-hidden
      bg-[#0b0d0e]
    ">

      {/* MOBILE HEADER */}

      <header className="
        h-[66px] shrink-0
        px-3
        flex items-center justify-between
        bg-[#0d0f10]
        border-b border-[#202426]
      ">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          title="Go back"
          className="
            w-9 h-9 shrink-0
            flex items-center justify-center
            rounded-xl
            text-[#a0aab0]
            hover:text-[#eab42e]
            hover:bg-white/[0.04]
            transition-colors
          "
        >
          <HiOutlineArrowLeft size={20} />
        </button>


        {/* PANEL TABS */}

        <nav className="
          flex items-center
          gap-1
          p-1
          rounded-xl
          bg-[#15191b]
          border border-[#272d30]
        ">

          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                className={`
                  relative
                  flex items-center justify-center
                  gap-1.5
                  px-2.5 sm:px-3
                  py-2
                  rounded-lg
                  text-[11px]
                  font-semibold
                  whitespace-nowrap
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-[#eab42e]/10 text-[#eab42e]'
                    : 'text-[#84909a] hover:text-[#e9eae7]'
                  }
                `}
              >

                <Icon size={15} />

                <span>
                  {tab.label}
                </span>

              </button>
            )
          })}

        </nav>

      </header>


      {/* ACTIVE PANEL */}

      <main className="
        flex-1 min-h-0
        overflow-hidden
        relative
      ">

        {activeTab === 'sources' && (
          <NoteLeftUpload />
        )}

        {activeTab === 'reader' && (
          <NoteContentShow />
        )}

        {activeTab === 'chat' && (
          <NoteChat />
        )}

      </main>

    </div>
  )
}

export default NoteBookPage

// import React, { useEffect } from 'react'
// import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
// import NoteChat from '../notebook/NoteChat'
// import NoteContentShow from '../notebook/NoteContentShow'
// import NoteLeftUpload from '../notebook/NoteLeftUpload'
// import { useNotebookStore } from '../store/notebookStore'
// import { motion } from 'framer-motion'

// const NoteBookPage = () => {
//   const { fetchOrCreateDefaultNotebook, isLoading, notebook } = useNotebookStore();

//   useEffect(() => {
//     fetchOrCreateDefaultNotebook();
//   }, []);

//   if (isLoading && !notebook) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full gap-4">
//         <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-sm font-medium text-[var(--text-muted)] animate-pulse">Initializing Workspace...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full overflow-hidden">
//       <PanelGroup direction="horizontal" className="h-full">
//         {/* Left Panel: Uploads & Sources */}
//         <Panel defaultSize={30} minSize={10} className="h-full">
//           <NoteLeftUpload />
//         </Panel>

//         <PanelResizeHandle className="w-1.5 group relative flex items-center border-none outline-none justify-center hover:bg-primary-500/10 transition-colors">
//           <div className="absolute w-1 h-6 rounded-full bg-[var(--border-main)] group-hover:bg-primary-500/50 group-active:bg-primary-500 transition-colors" />
//         </PanelResizeHandle>

//         {/* Middle Panel: Content Viewer */}
//         <Panel defaultSize={36} minSize={10} className="h-full">
//           <NoteContentShow />
//         </Panel>

//         <PanelResizeHandle className="w-1.5 group relative flex items-center border-none outline-none justify-center hover:bg-primary-500/10 transition-colors">
//           <div className="absolute w-1 h-6 rounded-full bg-[var(--border-main)] group-hover:bg-primary-500/50 group-active:bg-primary-500 transition-colors" />
//         </PanelResizeHandle>

//         {/* Right Panel: AI Chat */}
//         <Panel defaultSize={34} minSize={10} className="h-full">
//           <NoteChat />
//         </Panel>
//       </PanelGroup>
//     </div>
//   )
// }

// export default NoteBookPage
