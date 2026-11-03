
import React, { useState } from 'react'

import {
  HiDocumentText,
  HiLink,
  HiPlus,
  HiTrash,
  HiVideoCamera,
  HiCloudArrowUp,
  HiCommandLine,
} from 'react-icons/hi2'

import { useNotebookStore } from '../store/notebookStore'

const NoteLeftUpload = () => {
  const {
    sources,
    activeSource,
    setActiveSource,
    addSource,
    addLinkSource,
    addTextSource,
    deleteSource,
    isLoading,
  } = useNotebookStore()

  const [activeTab, setActiveTab] = useState(0)
  const [url, setUrl] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [textContent, setTextContent] = useState('')

  const tabs = [
    { id: 0, label: 'Text', icon: HiCommandLine },
    { id: 1, label: 'File', icon: HiCloudArrowUp },
    { id: 2, label: 'Web', icon: HiLink },
    { id: 3, label: 'YouTube', icon: HiVideoCamera },
  ]

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'file')

    await addSource(formData)
    e.target.value = ''
  }

  const handleAddLink = async () => {
    if (!url.trim() || isLoading) return

    await addLinkSource(
      activeTab === 2 ? 'url' : 'youtube',
      url.trim()
    )

    setUrl('')
  }

  const handleAddText = async () => {
    if (!textTitle.trim() || !textContent.trim() || isLoading) return

    await addTextSource(textTitle.trim(), textContent.trim())

    setTextTitle('')
    setTextContent('')
  }

  const inputClass = `
    w-full
    bg-[#101214]
    border border-[#222629]
    rounded-xl
    px-4 py-3
    text-sm text-[#f1f1ef]
    placeholder:text-[#74808c]
    outline-none
    transition-colors duration-200
    focus:border-[#eab42e]/60
    focus:bg-[#121416]
  `

  const buttonClass = `
    w-full h-11
    flex items-center justify-center gap-2
    rounded-xl
    bg-[#eab42e]
    hover:bg-[#f2bd42]
    text-[#17130a]
    text-sm font-semibold
    transition-colors duration-200
    disabled:opacity-40
    disabled:cursor-not-allowed
  `

  const getSourceIcon = (type) => {
    switch (type) {
      case 'file':
        return HiCloudArrowUp
      case 'url':
        return HiLink
      case 'youtube':
        return HiVideoCamera
      default:
        return HiDocumentText
    }
  }

  const getStatus = (status) => {
    switch (status) {
      case 'processing':
        return {
          label: 'Processing',
          color: 'text-[#eab42e]',
          dot: 'bg-[#eab42e]',
        }
      case 'failed':
        return {
          label: 'Failed',
          color: 'text-red-400',
          dot: 'bg-red-400',
        }
      case 'completed':
        return {
          label: 'Ready',
          color: 'text-emerald-400',
          dot: 'bg-emerald-400',
        }
      default:
        return null
    }
  }

  return (
    <aside className="
      h-full min-h-0
      flex flex-col
      bg-[#0b0d0e]
    ">

      {/* Panel Header & Source Input */}

      <div className="px-5 pt-6 pb-5 shrink-0">

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <HiDocumentText className="text-[#eab42e]" size={19} />

            <h2 className="
              text-sm font-semibold
              tracking-wide text-[#f1f1ef]
            ">
              Sources
            </h2>
          </div>

          <span className="
            px-2.5 py-1
            rounded-xs
            bg-[#eab42e]/10
            text-[#eab42e]
            text-[10px] font-semibold
            tabular-nums
          ">
            {sources.length == 0 ? "Empty" : `${sources.length} Total`}
          </span>
        </div>

        {/* Source Tabs */}

        <div className="
          flex items-center
          rounded-xl
          bg-[#101214]
          mb-5
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
                  flex-1 min-w-0
                  flex flex-col items-center justify-center
                  gap-1.5 py-2.5
                  rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-[#eab42e]/15 text-[#f0b832] shadow-sm'
                    : 'text-[#83909c] hover:text-[#e6e6e2] hover:bg-white/[0.035]'
                  }
                `}
              >
                <Icon size={17} />

                <span className="text-[10px] font-semibold">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Text Source */}

        {activeTab === 0 && (
          <div className="space-y-3">

            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="Note Title"
              className={inputClass}
            />

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter content here..."
              className={`
                ${inputClass}
                h-28 resize-none
                leading-relaxed
              `}
            />

            <button
              type="button"
              onClick={handleAddText}
              disabled={
                isLoading ||
                !textTitle.trim() ||
                !textContent.trim()
              }
              className={buttonClass}
            >
              <HiPlus size={17} />
              {isLoading ? 'Adding...' : 'Add Note'}
            </button>

          </div>
        )}

        {/* File Source */}

        {activeTab === 1 && (
          <label className="
            flex flex-col items-center justify-center
            h-44 w-full
            rounded-xl
            border border-dashed border-[#34393c]
            bg-[#101214]
            hover:border-[#eab42e]/50
            hover:bg-[#eab42e]/[0.025]
            cursor-pointer
            transition-all duration-200
            group
          ">
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.txt,.doc,.docx"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />

            <div className="
              w-11 h-11
              flex items-center justify-center
              rounded-xl
              bg-[#eab42e]/10
              text-[#eab42e]
              mb-3
              group-hover:scale-105
              transition-transform
            ">
              <HiCloudArrowUp size={23} />
            </div>

            <p className="text-sm font-medium text-[#e8e8e5]">
              {isLoading ? 'Uploading...' : 'Upload a document'}
            </p>

            <p className="text-[11px] text-[#7f8993] mt-1.5">
              PDF, PPT, DOCX or TXT
            </p>
          </label>
        )}

        {/* Web & YouTube Source */}

        {(activeTab === 2 || activeTab === 3) && (
          <div className="space-y-3">

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddLink()
              }}
              placeholder={
                activeTab === 2
                  ? 'Paste website URL...'
                  : 'Paste YouTube URL...'
              }
              className={inputClass}
            />

            <button
              type="button"
              onClick={handleAddLink}
              disabled={isLoading || !url.trim()}
              className={buttonClass}
            >
              <HiPlus size={17} />
              {isLoading
                ? 'Adding...'
                : activeTab === 2
                  ? 'Add Resource'
                  : 'Add Video'}
            </button>

          </div>
        )}

      </div>

      {/* Source List */}

      <div className="
        flex-1 min-h-0
        flex flex-col
        overflow-y-auto
        px-5 pb-5
      ">

        <div className="border-t border-[#202426] mb-3" />

        {sources.length > 0 ? (

          <div className="space-y-2">

            {sources.map((source) => {
              const Icon = getSourceIcon(source.type)
              const isActive = activeSource?._id === source._id
              const status = getStatus(source.status)

              return (
                <div
                  key={source._id}
                  onClick={() => setActiveSource(source)}
                  className={`
                    group
                    flex items-center gap-3
                    p-3 rounded-xl
                    border cursor-pointer
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[#eab42e]/[0.07] border-[#eab42e]/30'
                      : 'bg-[#101214] border-[#202426] hover:border-[#383e40] hover:bg-[#131618]'
                    }
                  `}
                >

                  <div className={`
                    w-9 h-9 shrink-0
                    flex items-center justify-center
                    rounded-lg
                    ${isActive
                      ? 'bg-[#eab42e]/15 text-[#eab42e]'
                      : 'bg-[#1a1e20] text-[#8996a1]'
                    }
                  `}>
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">

                    <h3 className={`
                      text-[13px] font-medium truncate
                      ${isActive
                        ? 'text-[#f0bd46]'
                        : 'text-[#e6e7e5]'
                      }
                    `}>
                      {source.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-1">

                      <span className="
                        text-[9px] uppercase
                        tracking-wider font-medium
                        text-[#78838c]
                      ">
                        {source.type}
                      </span>

                      {status && (
                        <span className={`
                          flex items-center gap-1
                          text-[10px] font-medium
                          ${status.color}
                        `}>
                          <span className={`
                            w-1.5 h-1.5 rounded-full
                            ${status.dot}
                          `} />
                          {status.label}
                        </span>
                      )}

                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Delete ${source.title}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSource(source._id)
                    }}
                    className="
                      shrink-0 p-2 rounded-lg
                      text-[#737e87]
                      hover:text-red-400
                      hover:bg-red-400/10
                      opacity-100 sm:opacity-0
                      sm:group-hover:opacity-100
                      focus:opacity-100
                      transition-all
                    "
                  >
                    <HiTrash size={15} />
                  </button>

                </div>
              )
            })}

          </div>

        ) : (

          /* Empty State */

          <div className="
            flex-1 min-h-[170px]
            flex flex-col
            items-center justify-center
            text-center
            py-8
          ">

            <div className="
              w-11 h-11
              flex items-center justify-center
              rounded-xl
              bg-[#141719]
              border border-[#262b2e]
              text-[#78848d]
              mb-3
            ">
              <HiCloudArrowUp size={21} />
            </div>

            <p className="
              text-xs font-semibold
              text-[#d8dad8]
            ">
              No sources yet
            </p>

            <p className="
              text-[11px] text-[#737f89]
              mt-1.5 leading-relaxed
            ">
              Add a note, file, or link to get started.
            </p>

          </div>

        )}

      </div>

    </aside>
  )
}

export default NoteLeftUpload

// import React, { useState } from 'react'
// import {
//   HiDocumentText,
//   HiLink,
//   HiPlus,
//   HiTrash,
//   HiVideoCamera,
//   HiCloudArrowUp,
//   HiCommandLine
// } from 'react-icons/hi2'
// import { useNotebookStore } from '../store/notebookStore'
// import { motion, AnimatePresence } from 'framer-motion'

// const NoteLeftUpload = () => {
//   const { sources, activeSource, setActiveSource, addSource, addLinkSource, addTextSource, deleteSource, isLoading } = useNotebookStore()
//   const [activeTab, setActiveTab] = useState(0)
//   const [url, setUrl] = useState('')
//   const [textTitle, setTextTitle] = useState('')
//   const [textContent, setTextContent] = useState('')

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     const formData = new FormData()
//     formData.append('file', file)
//     formData.append('type', 'file')
//     await addSource(formData)
//   }

//   const handleAddLink = async (type) => {
//     if (!url) return
//     await addLinkSource(type, url)
//     setUrl('')
//   }

//   const handleAddText = async () => {
//     if (!textTitle || !textContent) return
//     await addTextSource(textTitle, textContent)
//     setTextTitle('')
//     setTextContent('')
//   }

//   const tabs = [
//     { id: 0, label: 'Text', icon: HiCommandLine },
//     { id: 1, label: 'File', icon: HiCloudArrowUp },
//     { id: 2, label: 'Web', icon: HiLink },
//     { id: 3, label: 'YouTube', icon: HiVideoCamera },
//   ]

//   return (
//     <aside className="h-full flex flex-col border-r border-[var(--border-main)]">
//       <div className="p-6 pb-2">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Sources</h2>
//           <span className="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-500 text-[10px] font-bold">
//             {sources.length} Total
//           </span>
//         </div>

//         {/* Modern Tabs */}
//         <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-main)] mb-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               className={`
//                           flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all gap-1
//                           ${activeTab === tab.id
//                   ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
//                   : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5"}
//                         `}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               <tab.icon size={16} />
//               <span className="text-[10px] font-bold">{tab.label}</span>
//             </button>
//           ))}
//         </div>

//         {/* Tab Contents */}
//         <div className="mb-8">
//           <AnimatePresence mode="wait">
//             {activeTab === 0 && (
//               <motion.div
//                 key="text-tab"
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
//                 className="space-y-3"
//               >
//                 <input
//                   type="text"
//                   value={textTitle}
//                   onChange={e => setTextTitle(e.target.value)}
//                   placeholder="Note Title"
//                   className="w-full bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 transition-all"
//                 />
//                 <textarea
//                   value={textContent}
//                   onChange={e => setTextContent(e.target.value)}
//                   placeholder="Enter content here..."
//                   className="w-full resize-none bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 h-28 transition-all"
//                 ></textarea>
//                 <button
//                   onClick={handleAddText}
//                   disabled={isLoading || !textTitle || !textContent}
//                   className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
//                 >
//                   <HiPlus /> Add Note
//                 </button>
//               </motion.div>
//             )}
//             {activeTab === 1 && (
//               <motion.label
//                 key="file-tab"
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
//                 className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer border-[var(--border-main)] bg-[var(--bg-card)] hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group"
//               >
//                 <input type="file" className="hidden" onChange={handleFileUpload} />
//                 <div className="p-3 rounded-full bg-primary-500/10 text-primary-500 mb-3 group-hover:scale-110 transition-transform">
//                   <HiCloudArrowUp size={24} />
//                 </div>
//                 <p className="text-xs font-bold text-[var(--text-main)]">Drop files or click to upload</p>
//                 <p className="text-[10px] text-[var(--text-muted)] mt-1">PDF, DOCX, TXT supported</p>
//               </motion.label>
//             )}
//             {(activeTab === 2 || activeTab === 3) && (
//               <motion.div
//                 key="link-tab"
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
//                 className="space-y-3"
//               >
//                 <input
//                   type="text"
//                   value={url}
//                   onChange={e => setUrl(e.target.value)}
//                   placeholder={activeTab === 2 ? 'Paste URL here...' : 'Paste YouTube URL here...'}
//                   className="w-full bg-[var(--bg-card)] border border-[var(--border-main)] px-4 py-2.5 rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 transition-all"
//                 />
//                 <button
//                   onClick={() => handleAddLink(activeTab === 2 ? 'url' : 'youtube')}
//                   disabled={isLoading || !url}
//                   className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
//                 >
//                   <HiPlus /> Add {activeTab === 2 ? 'Resource' : 'Video'}
//                 </button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

//       {/* Source List */}
//       <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
//         <AnimatePresence initial={false}>
//           {sources.map((source) => (
//             <motion.div
//               key={source._id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 20 }}
//               onClick={() => setActiveSource(source)}
//               className={`
//                               group relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border
//                               ${activeSource?._id === source._id
//                   ? "bg-primary-500/10 border-primary-500/30 ring-1 ring-primary-500/30"
//                   : "bg-[var(--bg-card)] border-[var(--border-main)] hover:border-primary-500/50"}
//                             `}
//             >
//               <div className={`
//                               p-2 rounded-xl transition-colors
//                               ${activeSource?._id === source._id ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" : "bg-[var(--bg-main)] text-[var(--text-muted)]"}
//                             `}>
//                 {source.type === 'file' && <HiCloudArrowUp size={18} />}
//                 {source.type === 'url' && <HiLink size={18} />}
//                 {source.type === 'youtube' && <HiVideoCamera size={18} />}
//                 {source.type === 'text' && <HiCommandLine size={18} />}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className={`text-sm font-bold truncate transition-colors ${activeSource?._id === source._id ? "text-primary-500" : "text-[var(--text-main)]"}`}>
//                   {source.title}
//                 </h3>
//                 <div className="flex items-center gap-2 mt-0.5">
//                   <span className="text-[9px] font-black uppercase tracking-tighter text-[var(--text-muted)] opacity-60">
//                     {source.type}
//                   </span>
//                   {source.status === 'processing' && <span className="text-[9px] text-primary-500 font-bold animate-pulse">Processing...</span>}
//                   {source.status === 'failed' && <span className="text-[9px] text-red-500 font-bold">Failed</span>}
//                   {source.status === 'completed' && <span className="text-[9px] text-emerald-500 font-bold">Analyzed</span>}
//                 </div>
//               </div>
//               <button
//                 onClick={(e) => { e.stopPropagation(); deleteSource(source._id); }}
//                 className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-[var(--text-muted)]"
//               >
//                 <HiTrash size={16} />
//               </button>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//         {sources.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
//             <div className="w-12 h-12 rounded-2xl bg-[#12141c] border border-[var(--border-main)] flex items-center justify-center mb-4 text-[var(--text-muted)] opacity-20">
//               <HiCloudArrowUp size={24} />
//             </div>
//             <p className="text-xs font-bold text-[var(--text-muted)]">No sources yet</p>
//             <p className="text-[10px] text-[var(--text-muted)] opacity-50 mt-1">Add a note, file, or link to get started.</p>
//           </div>
//         )}
//       </div>
//     </aside>
//   )
// }

// export default NoteLeftUpload
