
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  HiOutlineCloudArrowUp,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlinePlay,
  HiOutlineClipboardDocument
} from 'react-icons/hi2';

import { useSolveStore } from '../store/solveStore';

export default function SolveInput() {
  const [manualText, setManualText] = useState('');
  const [file, setFile] = useState(null);

  const { processQuestions, isProcessing } = useSolveStore();

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const handleSubmit = () => {
    if ((!file && !manualText.trim()) || isProcessing) return;

    processQuestions(file, manualText);
  };

  const canSubmit = Boolean(file || manualText.trim());

  return (
    <section className="border-b border-[var(--border-main)]">

      {/* Section heading */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-normal text-[var(--text-main)]">
              Problem source
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Add a document or enter your questions.
            </p>
          </div>

          <div className="w-8 h-8 rounded-lg bg-[#eab42e]/10 flex items-center justify-center text-[#eab42e]">
            <HiOutlineClipboardDocument size={17} />
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">

        {/* File upload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[var(--text-main)]">
              Upload file
            </label>
            <span className="text-[10px] text-[var(--text-muted)]">
              Optional
            </span>
          </div>

          <div
            {...getRootProps()}
            className={`rounded-xl border border-dashed p-4 transition-colors ${
              isDragActive
                ? 'border-[#eab42e] bg-[#181C1F]'
                : 'border-[var(--border-main)] bg-[#101214] hover:border-[#eab42e]/50'
            }`}
          >
            <input {...getInputProps()} />

            {file ? (
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#eab42e]/10 text-[#eab42e] flex items-center justify-center">
                  <HiOutlineDocumentText size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text-main)] truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  aria-label="Remove file"
                >
                  <HiOutlineXMark size={17} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-3">
                <div className="w-10 h-10 rounded-xl border border-[var(--border-main)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] mb-3">
                  <HiOutlineCloudArrowUp size={21} />
                </div>

                <p className="text-xs font-medium text-[var(--text-main)]">
                  {isDragActive ? 'Drop your file here' : 'Drag and drop a file'}
                </p>

                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  PDF, DOCX, TXT or image
                </p>

                <button
                  type="button"
                  onClick={open}
                  className="mt-3 text-[11px] font-semibold text-[#eab42e] hover:text-[#f3c44f] transition-colors"
                >
                  Browse files
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Manual input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[var(--text-main)]">
              Your questions
            </label>
            <span className="text-[10px] text-[var(--text-muted)]">
              {manualText.length} characters
            </span>
          </div>

          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Type or paste your questions here..."
            className="w-full min-h-[190px] resize-y rounded-xl border border-[var(--border-main)] bg-[#101214] p-3.5 text-sm leading-relaxed text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[#eab42e]/60"
          />

          <p className="text-[10px] leading-relaxed text-[var(--text-muted)]">
            You can upload a file, enter text, or use both together.
          </p>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing || !canSubmit}
          className="w-full h-10 rounded-lg bg-[#eab42e] hover:bg-[#f0bd3f] text-[#17140c] text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-[#17140c]/30 border-t-[#17140c] animate-spin" />
              Analyzing questions...
            </>
          ) : (
            <>
              <HiOutlinePlay size={15} />
              Run solver
            </>
          )}
        </button>
      </div>
    </section>
  );
}

// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { 
//   HiOutlineCloudArrowUp, 
//   HiOutlineDocumentText, 
//   HiOutlineXMark,
//   HiOutlinePlay
// } from 'react-icons/hi2';
// import { useSolveStore } from '../store/solveStore';

// export default function SolveInput() {
//   const [manualText, setManualText] = useState('');
//   const [file, setFile] = useState(null);
//   const { processQuestions, isProcessing } = useSolveStore();

//   const onDrop = (acceptedFiles) => {
//     setFile(acceptedFiles[0]);
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     multiple: false,
//     accept: {
//       'application/pdf': ['.pdf'],
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
//       'text/plain': ['.txt'],
//       'image/*': ['.png', '.jpg', '.jpeg']
//     }
//   });

//   const handleSubmit = () => {
//     if (!file && !manualText.trim()) return;
//     processQuestions(file, manualText);
//   };

//   return (
//     <div className="flex flex-col border-b border-[var(--border-main)]">
//       <div className="p-5 space-y-6">
        
//         {/* Header */}
//         <div>
//             <h2 className="text-sm font-bold text-[var(--text-main)]">Problem Source</h2>
//             <p className="text-xs text-[var(--text-muted)] mt-0.5">Upload a document or paste text to solve.</p>
//         </div>

//         {/* File Upload Section */}
//         <div className="space-y-2">
//           <label className="text-xs font-semibold text-[var(--text-muted)]">File Upload</label>
//           <div 
//             {...getRootProps()} 
//             className={`
//               relative border border-dashed rounded-md p-4 transition-all cursor-pointer
//               flex items-center gap-3
//               ${isDragActive 
//                 ? 'border-primary-500 bg-primary-500/10' 
//                 : 'border-[var(--border-main)] hover:border-primary-500/50 bg-[var(--bg-main)]'}
//             `}
//           >
//             <input {...getInputProps()} />
//             <div className={`p-2 rounded bg-[var(--bg-card)] border border-[var(--border-main)] ${file ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>
//               {file ? <HiOutlineDocumentText size={20} /> : <HiOutlineCloudArrowUp size={20} />}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-[var(--text-main)] truncate">
//                 {file ? file.name : 'Click or drag file here'}
//               </p>
//               {!file && <p className="text-xs text-[var(--text-muted)] mt-0.5">PDF, DOCX, TXT, IMG</p>}
//             </div>
//             {file && (
//               <button 
//                 onClick={(e) => { e.stopPropagation(); setFile(null); }}
//                 className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all"
//               >
//                 <HiOutlineXMark size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Manual Input Section */}
//         <div className="space-y-2">
//           <label className="text-xs font-semibold text-[var(--text-muted)]">Manual Input</label>
//           <textarea
//             value={manualText}
//             onChange={(e) => setManualText(e.target.value)}
//             placeholder="Type or paste questions here..."
//             className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] rounded-md p-3 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-primary-500/50 min-h-[200px] resize-y transition-all font-mono"
//           />
//         </div>
//       </div>

//       <div className="p-5 pt-0">
//         <button
//           onClick={handleSubmit}
//           disabled={isProcessing || (!file && !manualText.trim())}
//           className="
//             w-full py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:bg-[var(--border-main)] disabled:text-[var(--text-muted)]
//             text-white text-sm font-semibold rounded-md transition-all 
//             flex items-center justify-center gap-2 active:scale-[0.98]
//           "
//         >
//           {isProcessing ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
//               <span>Analyzing...</span>
//             </>
//           ) : (
//             <>
//               <HiOutlinePlay size={16} />
//               <span>Run Solver</span>
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
