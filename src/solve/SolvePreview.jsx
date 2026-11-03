
import React, { useRef, useState } from 'react';
import { useSolveStore } from '../store/solveStore';

import {
  HiOutlineArrowDownTray,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineCheck,
  HiOutlineSparkles
} from 'react-icons/hi2';

import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';

export default function SolvePreview() {
  const { questions, updateAnswer, isProcessing } = useSolveStore();

  const [editingIndex, setEditingIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const pdfRef = useRef(null);

  const handleGeneratePDF = async () => {
    if (!pdfRef.current || isGenerating) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const margin = 18;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin * 2;

      let y = margin;

      const ensureSpace = (height) => {
        if (y + height > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
      };

      const writeText = (text, {
        font = 'normal',
        size = 10,
        indent = 0,
        color = [55, 55, 55],
        spacing = 2
      } = {}) => {
        pdf.setFont('helvetica', font);
        pdf.setFontSize(size);
        pdf.setTextColor(...color);

        const availableWidth = contentWidth - indent;
        const lines = pdf.splitTextToSize(text, availableWidth);
        const lineHeight = size * 0.42;

        lines.forEach((line) => {
          ensureSpace(lineHeight + 1);
          pdf.text(line, margin + indent, y);
          y += lineHeight;
        });

        y += spacing;
      };

      // Document title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(35, 35, 35);
      pdf.text('Solved Questions', margin, y);
      y += 9;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(130, 130, 130);
      pdf.text(
        `${questions.length} ${questions.length === 1 ? 'question' : 'questions'}`,
        margin,
        y
      );
      y += 10;

      // Questions and answers
      questions.forEach((item, index) => {
        ensureSpace(20);

        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 7;

        writeText(`Q${index + 1}. ${item.question}`, {
          font: 'bold',
          size: 11,
          color: [35, 35, 35],
          spacing: 4
        });

        const answerLines = (item.answer || '').split('\n');

        answerLines.forEach((rawLine) => {
          const line = rawLine.trim();

          if (!line) {
            y += 2;
            return;
          }

          // Basic Markdown cleanup and formatting
          if (/^#{1,6}\s/.test(line)) {
            writeText(line.replace(/^#{1,6}\s/, '').replace(/\*\*/g, ''), {
              font: 'bold',
              size: 11,
              indent: 4,
              color: [45, 45, 45],
              spacing: 3
            });
          } else if (/^[-*+]\s/.test(line)) {
            writeText(`• ${line.replace(/^[-*+]\s/, '').replace(/\*\*/g, '')}`, {
              size: 10,
              indent: 5
            });
          } else if (/^\d+\.\s/.test(line)) {
            writeText(line.replace(/\*\*/g, ''), {
              size: 10,
              indent: 5
            });
          } else {
            writeText(
              line
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/^>\s?/, ''),
              {
                size: 10,
                indent: 4,
                color: [65, 65, 65]
              }
            );
          }
        });

        y += 5;
      });

      pdf.save('Solutions.pdf');
    } catch (error) {
      console.error('PDF export error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Processing state
  if (isProcessing) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-11 h-11 rounded-xl bg-[#eab42e]/10 flex items-center justify-center mb-4">
          <HiOutlineSparkles size={22} className="text-[#eab42e]" />
        </div>

        <div className="w-5 h-5 rounded-full border-2 border-[var(--border-main)] border-t-[#eab42e] animate-spin mb-4" />

        <p className="text-sm font-medium text-[var(--text-main)]">
          Working on your solutions
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Analyzing your questions. This may take a moment.
        </p>
      </div>
    );
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-main)] flex items-center justify-center mb-4">
          <HiOutlineDocumentText
            size={25}
            className="text-[var(--text-muted)]"
          />
        </div>

        <h3 className="text-sm font-semibold text-[var(--text-main)]">
          Your solutions will appear here
        </h3>

        <p className="max-w-[260px] text-xs leading-relaxed text-[var(--text-muted)] mt-2">
          Add a document or enter your questions, then run the solver to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[var(--bg-main)]">

      {/* Toolbar */}
      <header className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-[var(--border-main)] bg-[var(--bg-card)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">
              Solutions
            </h2>

            <span className="px-2 py-0.5 rounded-md bg-[#eab42e]/10 text-[#eab42e] text-[10px] font-semibold tabular-nums">
              {questions.length}
            </span>
          </div>

          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
            Review and edit your generated answers
          </p>
        </div>

        <button
          type="button"
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          className="shrink-0 h-8 px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-main)] text-xs font-medium text-[var(--text-main)] flex items-center gap-2 hover:border-[#eab42e]/50 hover:text-[#eab42e] transition-colors disabled:opacity-50"
        >
          <HiOutlineArrowDownTray size={14} />
          <span>{isGenerating ? 'Exporting...' : 'Export PDF'}</span>
        </button>
      </header>

      {/* Document */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-6 sm:py-8">
        <div
          ref={pdfRef}
          className="max-w-3xl mx-auto pb-12"
        >
          <div className="mb-8 pb-5 border-b border-[var(--border-main)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#eab42e] mb-2">
              Study workspace
            </p>

            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-main)]">
              Solved Questions
            </h1>

            <p className="text-xs text-[var(--text-muted)] mt-2">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'} answered
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((item, idx) => (
              <article key={idx} className="group">

                {/* Question */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="shrink-0 mt-0.5 text-[10px] font-bold text-[#eab42e] bg-[#eab42e]/10 rounded-md px-2 py-1">
                    Q{idx + 1}
                  </span>

                  <h3 className="flex-1 text-sm sm:text-[15px] font-semibold leading-relaxed text-[var(--text-main)]">
                    {item.question}
                  </h3>
                </div>

                {/* Answer */}
                <div className="ml-2 sm:ml-3 pl-4 sm:pl-5 border-l border-[var(--border-main)]">
                  {editingIndex === idx ? (
                    <div className="space-y-2">
                      <textarea
                        autoFocus
                        value={item.answer}
                        onChange={(e) => updateAnswer(idx, e.target.value)}
                        className="w-full min-h-[150px] resize-y rounded-lg border border-[#eab42e]/50 bg-[var(--bg-card)] p-3 text-sm leading-relaxed text-[var(--text-main)] outline-none"
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#eab42e] text-[#17140c] text-xs font-semibold hover:bg-[#f0bd3f] transition-colors"
                        >
                          <HiOutlineCheck size={14} />
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setEditingIndex(idx)}
                        aria-label={`Edit answer ${idx + 1}`}
                        className="absolute top-0 right-0 z-10 w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-muted)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[var(--bg-card)] hover:text-[#eab42e] transition-all"
                      >
                        <HiOutlinePencilSquare size={15} />
                      </button>

                      <div
                        onClick={() => setEditingIndex(idx)}
                        className="pr-8 text-sm leading-7 text-[var(--text-muted)] cursor-text rounded-lg hover:bg-[var(--bg-card)]/60 transition-colors"
                      >
                        <div className="prose prose-sm prose-invert max-w-none
                          prose-headings:text-[var(--text-main)]
                          prose-headings:font-semibold
                          prose-p:text-[var(--text-muted)]
                          prose-p:leading-7
                          prose-strong:text-[var(--text-main)]
                          prose-li:text-[var(--text-muted)]
                          prose-code:text-[#eab42e]
                          prose-pre:bg-[var(--bg-card)]
                          prose-blockquote:border-[#eab42e]/50
                          prose-a:text-[#eab42e]">
                          <ReactMarkdown>
                            {item.answer || ''}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useRef, useState } from 'react';
// import { useSolveStore } from '../store/solveStore';
// import { 
//   HiOutlineArrowDownTray,
//   HiOutlineCodeBracketSquare
// } from 'react-icons/hi2';
// import jsPDF from 'jspdf';
// import ReactMarkdown from "react-markdown"

// export default function SolvePreview() {
//   const { questions, updateAnswer, isProcessing } = useSolveStore();
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const pdfRef = useRef(null);

//   const handleGeneratePDF = async () => {
//     setIsGenerating(true);
//     try {
//       const pdf = new jsPDF({
//         orientation: "p",
//         unit: "mm",
//         format: "a4",
//       });

//       const margin = 15;
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const maxLineWidth = pageWidth - margin * 2;

//       let y = margin;
//       const lineHeight = 7;

//       const element = pdfRef.current;
//       const textContent = element.innerText || element.textContent;
//       const lines = textContent.split("\n");

//       pdf.setFont("helvetica", "bold");
//       pdf.setFontSize(14);
//       pdf.text("Solved Questions", margin, y);
//       y += 10;

//       lines.forEach((line) => {
//         const trimmed = line.trim();
//         if (!trimmed) return;

//         const isQuestion = /^\d+\./.test(trimmed) || /^Q\d+/i.test(trimmed) || trimmed.endsWith("?");

//         if (isQuestion) {
//           pdf.setFont("helvetica", "bold");
//           pdf.setFontSize(11);
//         } else {
//           pdf.setFont("helvetica", "normal");
//           pdf.setFontSize(10);
//         }

//         const wrappedLines = pdf.splitTextToSize(trimmed, maxLineWidth);

//         wrappedLines.forEach((wrapLine) => {
//           if (y + lineHeight > pageHeight - margin) {
//             pdf.addPage();
//             y = margin;
//           }
//           pdf.text(wrapLine, margin, y);
//           y += lineHeight;
//         });

//         y += 2;
//       });

//       pdf.save("Solutions.pdf");
//     } catch (error) {
//       console.error("PDF Error:", error);
//     }
//     setIsGenerating(false);
//   };

//   if (isProcessing) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)]">
//         <div className="w-8 h-8 border-2 border-[var(--text-muted)] border-t-[var(--text-main)] rounded-full animate-spin mb-4" />
//         <p className="text-sm font-medium">Processing your request...</p>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)]">
//         <HiOutlineCodeBracketSquare size={32} className="opacity-50 mb-3" />
//         <p className="text-sm font-medium">Output will appear here</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col h-full bg-[var(--bg-main)]">
//       {/* Header Toolbar */}
//       <div className="px-6 py-3 border-b border-[var(--border-main)] flex items-center justify-between shrink-0 bg-[var(--bg-card)]">
//         <h3 className="text-sm font-semibold text-[var(--text-main)]">Solutions <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold">{questions.length}</span></h3>
//         <button
//           onClick={handleGeneratePDF}
//           disabled={isGenerating}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] border border-[var(--border-main)] text-xs font-medium rounded transition-all active:scale-95 disabled:opacity-50"
//         >
//           <HiOutlineArrowDownTray size={14} />
//           {isGenerating ? 'Exporting...' : 'Export PDF'}
//         </button>
//       </div>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
//         <div ref={pdfRef} className="max-w-3xl mx-auto space-y-8 pb-12">
//           {questions.map((item, idx) => (
//             <div key={idx} className="space-y-3">
//               <h4 className="text-sm font-bold text-[var(--text-main)] flex items-start gap-2">
//                 <span className="text-[var(--text-muted)] shrink-0">Q{idx + 1}.</span>
//                 <span>{item.question}</span>
//               </h4>
//               <div className="pl-6 border-l-2 border-[var(--border-main)]">
//                 {editingIndex === idx ? (
//                   <textarea
//                     autoFocus
//                     value={item.answer}
//                     onChange={(e) => updateAnswer(idx, e.target.value)}
//                     onBlur={() => setEditingIndex(null)}
//                     className="w-full bg-[var(--bg-card)] text-sm leading-relaxed p-3 rounded border border-[var(--border-main)] outline-none resize-y min-h-[100px] font-mono"
//                   />
//                 ) : (
//                   <div 
//                     className="prose prose-sm prose-invert max-w-none text-[var(--text-main)] leading-relaxed font-serif cursor-text p-2 hover:bg-[var(--bg-card)] rounded transition-colors"
//                     onClick={() => setEditingIndex(idx)}
//                   >
//                     <ReactMarkdown>{item.answer}</ReactMarkdown>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
