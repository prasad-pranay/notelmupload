
import React, { useState } from 'react';
import { HiOutlinePencilSquare, HiOutlineDocumentCheck } from 'react-icons/hi2';

import SolveInput from '../solve/SolveInput';
import SolvePreview from '../solve/SolvePreview';
import SolveConfig from '../solve/SolveConfig';

export default function SolvePage() {
  const [activeTab, setActiveTab] = useState('input');

  return (
    <div className="h-[calc(100dvh-66px)] min-h-0 flex flex-col overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* Mobile header */}
      <div className="lg:hidden shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--border-main)] bg-[var(--bg-card)]">
        <div>
          <h1 className="text-sm font-semibold text-[var(--text-main)]">
            Solve
          </h1>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Work through your questions
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-main)]">
          <button
            type="button"
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'input'
              ? 'bg-[#eab42e]/10 text-[#eab42e]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
          >
            <HiOutlinePencilSquare size={14} />
            Input
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('solutions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === 'solutions'
              ? 'bg-[#eab42e]/10 text-[#eab42e]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
          >
            <HiOutlineDocumentCheck size={14} />
            Solutions
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">

        {/* Left: Input + Configuration */}
        <aside
          className={`${activeTab === 'input' ? 'flex' : 'hidden'
            } lg:flex w-full lg:w-[400px] xl:w-[440px] shrink-0 min-h-0 flex-col border-r border-[var(--border-main)] bg-[#0B0D0E]`}
        >
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <SolveInput />
            <SolveConfig />
          </div>
        </aside>

        {/* Right: Solution preview */}
        <main
          className={`${activeTab === 'solutions' ? 'flex' : 'hidden'
            } lg:flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden bg-[#0B0D0E]`}
        >
          <SolvePreview />
        </main>
      </div>
    </div>
  );
}

// import React from 'react';
// import SolveInput from '../solve/SolveInput';
// import SolvePreview from '../solve/SolvePreview';
// import SolveConfig from '../solve/SolveConfig';

// export default function SolvePage() {
//   return (
//     <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">
//       {/* Left Column: Editor/Input */}
//       <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 border-r border-[var(--border-main)] flex flex-col h-full bg-[var(--bg-card)] shadow-xl z-10">
//         <div className="flex-1 overflow-y-auto custom-scrollbar">
//           <SolveInput />
//           <SolveConfig />
//         </div>
//       </div>

//       {/* Right Column: Preview/Results */}
//       <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-main)]">
//         <SolvePreview />
//       </div>
//     </div>
//   );
// }
