
import React, { useState, useRef, useEffect } from 'react'
import { useNotebookStore } from '../store/notebookStore'

import {
  HiPaperAirplane,
  HiSparkles,
  HiOutlineUser,
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2'

import ReactMarkdown from 'react-markdown'

const NoteChat = () => {
  const {
    chatHistory,
    sendMessage,
    isLoading,
    clearChat,
    sources,
    setActiveSource,
  } = useNotebookStore()

  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // ------------------------------------------
  // SOURCE NAVIGATION
  // ------------------------------------------

  const handleSourceClick = (sourceId) => {
    const source = sources.find(s => s._id === sourceId)

    if (source) {
      setActiveSource(source)
    }
  }

  // ------------------------------------------
  // AUTO SCROLL
  // ------------------------------------------

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [chatHistory, isLoading])

  // ------------------------------------------
  // SEND MESSAGE
  // ------------------------------------------

  const handleSend = async (e) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const message = input.trim()

    setInput('')

    try {
      await sendMessage(message)
    } catch (error) {
      console.error('Failed to send message:', error)
      setInput(message)
    }
  }

  // ------------------------------------------
  // MAIN UI
  // ------------------------------------------

  return (
    <aside className="
      h-full min-w-0
      flex flex-col
      bg-[#0b0d0e]
      text-[#f1f1ef]
      overflow-hidden relative
    ">

      {/* ----------------------------------
          HEADER
      ---------------------------------- */}

      <div className="
        h-[65px] shrink-0
        px-5
        flex items-center justify-between
        bg-[#0d0f10]
      ">

        <div className="flex items-center gap-3">

          <div className="
            w-9 h-9
            flex items-center justify-center
            rounded-xl
          ">
            <HiOutlineChatBubbleLeftRight
              size={18}
              className="text-[#eab42e]"
            />
          </div>

          <div>
            <h3 className="
              text-sm font-semibold
              tracking-wide
              text-[#eeeeeb]
            ">
              Chat
            </h3>

            {/* <p className="
              text-[10px]
              text-[#77838c]
              mt-0.5
            ">
              Notebook assistant
            </p> */}
          </div>

        </div>

        <button
          type="button"
          onClick={clearChat}
          disabled={chatHistory.length === 0 || isLoading}
          title="Clear chat"
          aria-label="Clear chat"
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-lg
            text-[#78838c]
            hover:text-red-400
            hover:bg-red-400/[0.08]
            disabled:opacity-30
            disabled:cursor-not-allowed
            transition-colors
          "
        >
          <HiOutlineTrash size={17} />
        </button>

      </div>


      {/* ----------------------------------
          CHAT MESSAGES
      ---------------------------------- */}

      <div className="
        flex-1 min-h-0
        overflow-y-auto
        px-4 py-5
        md:px-5 md:py-6
        space-y-6
        custom-scrollbar
      ">

        {/* EMPTY STATE */}

        {chatHistory.length === 0 && (

          <div className="
            min-h-full
            flex flex-col
            items-center justify-center
            text-center
            px-3 py-8
          ">

            <div className="
              w-[68px] h-[68px]
              flex items-center justify-center
              rounded-[20px]
              bg-[#eab42e]
              mb-6
            ">
              <HiSparkles
                size={29}
                className="text-[#111]"
              />
            </div>

            <h3 className="
              text-[13px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#e9eae7]
              mb-3
            ">
              Intelligence
            </h3>

            <p className="
              max-w-[235px]
              text-xs
              leading-[1.8]
              text-[#84909a]
            ">
              Ask me anything about your current notebook.
              I'll search through your notes, files, and transcripts.
            </p>

            <div className="
              w-8 h-px
              bg-[#eab42e]/40
              mt-7
            " />

          </div>

        )}


        {/* MESSAGE LIST */}

        {chatHistory.map((msg, i) => {

          const isUser = msg.role === 'user'

          return (

            <div
              key={msg._id || i}
              className={`
                flex gap-2.5 md:gap-3
                ${isUser ? 'flex-row-reverse' : 'flex-row'}
              `}
            >

              {/* AVATAR */}

              <div className={`
                w-8 h-8 shrink-0
                rounded-xl
                flex items-center justify-center
                border
                ${isUser
                  ? 'bg-[#181b1d] border-[#303638] text-[#a3adb4]'
                  : 'bg-[#eab42e]/10 border-[#eab42e]/15 text-[#eab42e]'
                }
              `}>
                {isUser ? (
                  <HiOutlineUser size={16} />
                ) : (
                  <HiSparkles size={16} />
                )}
              </div>


              {/* MESSAGE CONTENT */}

              <div className={`
                min-w-0
                max-w-[88%]
                flex flex-col
                gap-2
                ${isUser ? 'items-end' : 'items-start'}
              `}>

                {/* BUBBLE */}

                <div className={`
                  px-3.5 py-3
                  rounded-xl
                  text-[13px]
                  leading-[1.8]
                  break-words
                  ${isUser
                    ? 'bg-[#29220f]/50 border border-[#eab42e]/20 text-[#eeeae0] rounded-tr-sm'
                    : 'bg-[#111517] border border-[#272d30] text-[#c9cecf] rounded-tl-sm'
                  }
                `}>

                  <div className="
                    prose prose-sm prose-invert
                    max-w-none
                    break-words
                    prose-p:my-1.5
                    prose-p:leading-[1.8]
                    prose-headings:text-[#eeeeeb]
                    prose-headings:font-semibold
                    prose-headings:mt-4
                    prose-headings:mb-2
                    prose-strong:text-[#f0efeb]
                    prose-a:text-[#eab42e]
                    prose-li:marker:text-[#eab42e]
                    prose-code:text-[#eab42e]
                    prose-code:bg-[#1b2022]
                    prose-code:px-1
                    prose-code:rounded
                    prose-pre:bg-[#0b0d0e]
                    prose-pre:border
                    prose-pre:border-[#272d30]
                    prose-blockquote:border-[#eab42e]/40
                    prose-blockquote:text-[#929da4]
                  ">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                </div>


                {/* SOURCE CITATIONS */}

                {msg.sources && msg.sources.length > 0 && (

                  <div className="
                    flex flex-wrap gap-1.5
                    max-w-full
                  ">

                    {msg.sources.map((source, si) => (

                      <button
                        key={si}
                        type="button"
                        onClick={() => handleSourceClick(source.sourceId)}
                        title={`Open ${source.title}`}
                        className="
                          group
                          max-w-full
                          flex items-center gap-1.5
                          px-2.5 py-1.5
                          rounded-lg
                          bg-[#15191b]
                          border border-[#303638]
                          text-[10px]
                          font-medium
                          text-[#9ba5aa]
                          hover:text-[#eab42e]
                          hover:border-[#eab42e]/40
                          transition-colors
                        "
                      >

                        <HiOutlineBookOpen
                          size={12}
                          className="
                            shrink-0
                            text-[#eab42e]
                          "
                        />

                        <span className="truncate max-w-[120px]">
                          {source.title}
                        </span>

                      </button>

                    ))}

                  </div>

                )}

              </div>

            </div>

          )
        })}


        {/* ----------------------------------
            THINKING INDICATOR
        ---------------------------------- */}

        {isLoading && (

          <div className="flex gap-3 items-start">

            <div className="
              w-8 h-8 shrink-0
              rounded-xl
              flex items-center justify-center
              bg-[#eab42e]/10
              border border-[#eab42e]/15
            ">
              <HiSparkles
                size={16}
                className="text-[#eab42e]"
              />
            </div>

            <div className="
              flex items-center gap-1.5
              px-4 py-3.5
              bg-[#111517]
              border border-[#272d30]
              rounded-xl rounded-tl-sm
            ">

              <span className="
                w-1.5 h-1.5 rounded-full
                bg-[#eab42e]
                animate-bounce
                [animation-delay:-0.3s]
              " />

              <span className="
                w-1.5 h-1.5 rounded-full
                bg-[#eab42e]
                animate-bounce
                [animation-delay:-0.15s]
              " />

              <span className="
                w-1.5 h-1.5 rounded-full
                bg-[#eab42e]
                animate-bounce
              " />

            </div>

          </div>

        )}

        <div ref={chatEndRef} />

      </div>


      {/* ----------------------------------
          MESSAGE INPUT
      ---------------------------------- */}

      <div className="
        absolute bottom-0 w-full
        left-0 p-3
      ">

        <form
          onSubmit={handleSend}
          className="
            relative
            flex items-center
            bg-[#111416]
            border border-[#292f31]
            rounded-2xl
            transition-colors
            focus-within:border-[#eab42e]/45
            hover:border-[#41494c]
          "
        >

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your notebook..."
            disabled={isLoading}
            className="
              w-full
              min-w-0
              bg-transparent
              py-4 pl-4 pr-14
              text-[13px]
              text-[#e9eae7]
              placeholder:text-[#77838c]
              outline-none
              disabled:opacity-50
            "
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            title="Send message"
            aria-label="Send message"
            className="
              absolute right-2
              w-9 h-9
              flex items-center justify-center
              rounded-xl
              bg-[#eab42e]
              text-[#17130a]
              hover:bg-[#f2bd42]
              disabled:bg-[#252a2c]
              disabled:text-[#606b72]
              disabled:cursor-not-allowed
              transition-colors
            "
          >
            <HiPaperAirplane
              size={17}
              className="-rotate-45 translate-x-[1px] -translate-y-[1px]"
            />
          </button>

        </form>

      </div>

    </aside>
  )
}

export default NoteChat

// import React, { useState, useRef, useEffect } from 'react'
// import { useNotebookStore } from '../store/notebookStore'
// import {
//   HiPaperAirplane,
//   HiSparkles,
//   HiOutlineUser,
//   HiOutlineTrash,
//   HiOutlineBookOpen,
//   HiOutlineChatBubbleLeftRight
// } from 'react-icons/hi2'
// import { motion, AnimatePresence } from 'framer-motion'
// import ReactMarkdown from 'react-markdown'

// const NoteChat = () => {
//   const { chatHistory, sendMessage, isLoading, clearChat, sources, setActiveSource } = useNotebookStore()
//   const [input, setInput] = useState('')
//   const chatEndRef = useRef(null)

//   const handleSourceClick = (sourceId) => {
//     const source = sources.find(s => s._id === sourceId)
//     if (source) {
//       setActiveSource(source)
//     }
//   }

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [chatHistory])

//   const handleSend = async (e) => {
//     e.preventDefault()
//     if (!input.trim() || isLoading) return
//     const msg = input
//     setInput('')
//     await sendMessage(msg)
//   }

//   return (
//     <aside className="h-full flex flex-col bg-[var(--bg-card)]">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-[var(--border-main)] flex items-center justify-between bg-[var(--bg-navbar)] backdrop-blur-md">
//         <div className="flex items-center gap-2.5">
//           <div className="p-1.5 rounded-lg bg-primary-500/10 text-primary-500">
//             <HiOutlineChatBubbleLeftRight size={18} />
//           </div>
//           <span className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Chat</span>
//         </div>
//         <button
//           onClick={clearChat}
//           className="p-2 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 rounded-xl transition-all"
//           title="Clear Chat"
//         >
//           <HiOutlineTrash size={18} />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
//         {chatHistory.length === 0 && (
//           <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
//             <div className="w-16 h-16 rounded-[2rem] bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20">
//               <HiSparkles className="text-primary-500" size={28} />
//             </div>
//             <h3 className="text-[var(--text-main)] font-black text-sm uppercase tracking-widest mb-3">Notebook Intelligence</h3>
//             <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[200px]">
//               Ask me anything about your current notebook. I'll search through your notes, files, and transcripts.
//             </p>
//           </div>
//         )}

//         {chatHistory.map((msg, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
//           >
//             <div className={`
//                           w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg
//                           ${msg.role === 'user' ? 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-main)]' : 'bg-primary-600 text-white shadow-primary-500/20'}
//                         `}>
//               {msg.role === 'user' ? <HiOutlineUser size={16} /> : <HiSparkles size={16} />}
//             </div>
//             <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
//               <div className={`
//                               px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
//                               ${msg.role === 'user'
//                   ? 'bg-primary-600/10 text-[var(--text-main)] border border-primary-500/20 rounded-tr-none'
//                   : 'bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-tl-none'}
//                             `}>
//                 <div className="prose prose-sm prose-invert max-w-none">
//                   <ReactMarkdown>{msg.content}</ReactMarkdown>
//                 </div>
//               </div>

//               {/* Source Citations */}
//               {msg.sources && msg.sources.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {msg.sources.map((source, si) => (
//                     <button
//                       key={si}
//                       onClick={() => handleSourceClick(source.sourceId)}
//                       className="group flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-lg text-[10px] font-bold text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all active:scale-95"
//                       title={source.title}
//                     >
//                       <HiOutlineBookOpen className="w-3 h-3 group-hover:scale-110 transition-transform" />
//                       <span className="truncate max-w-[100px]">{source.title}</span>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         ))}

//         {isLoading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex gap-4"
//           >
//             <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center animate-pulse shadow-lg shadow-primary-500/20">
//               <HiSparkles className="text-white" size={16} />
//             </div>
//             <div className="flex items-center gap-1.5 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl rounded-tl-none">
//               <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
//               <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
//               <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
//             </div>
//           </motion.div>
//         )}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-6 bg-[#0a0a0c] border-t border-[var(--border-main)] backdrop-blur-md">
//         <form onSubmit={handleSend} className="relative group">
//           <input
//             type="text"
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             placeholder="Ask your notebook..."
//             className="
//                     w-full bg-[#121214] border border-[var(--border-main)] rounded-2xl py-4 pl-5 pr-14 text-sm
//                     text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none
//                     focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all
//                     group-hover:border-[var(--text-muted)]/30
//                   "
//           />
//           <button
//             type="submit"
//             disabled={!input.trim() || isLoading}
//             className="
//                     absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl
//                     bg-primary-600 flex items-center justify-center text-white
//                     hover:bg-primary-500 disabled:opacity-20 disabled:grayscale transition-all
//                     active:scale-90 shadow-lg shadow-primary-600/20
//                   "
//           >
//             <HiPaperAirplane className="w-5 h-5 -rotate-45 -translate-y-0.5 translate-x-0.5" />
//           </button>
//         </form>
//       </div>
//     </aside>
//   )
// }

// export default NoteChat

