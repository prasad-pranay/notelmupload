
import React from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { useSolveStore } from '../store/solveStore';

const options = [
  {
    label: 'Detail',
    key: 'detailLevel',
    values: ['short', 'medium', 'detailed']
  },
  {
    label: 'Format',
    key: 'style',
    values: ['bullet', 'paragraph', 'step-by-step']
  },
  {
    label: 'Difficulty',
    key: 'difficulty',
    values: ['beginner', 'exam', 'advanced']
  }
];

const formatLabel = (value) =>
  value.replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export default function SolveConfig() {
  const { config, setConfig } = useSolveStore();

  return (
    <section className="p-5 space-y-5">

      {/* Heading */}
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-[var(--bg-main)] py-3 px-3 flex items-center justify-center text-[var(--text-muted)]">
          <HiOutlineAdjustmentsHorizontal size={22} />
        </div>

        <div>
          <h2 className="text-lg font-normal text-[var(--text-main)]">
            Solve preferences
          </h2>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            Customize how answers are generated.
          </p>
        </div>
      </div>

      {/* Segmented options */}
      <div className="space-y-4">
        {options.map((opt) => (
          <div key={opt.key} className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              {opt.label}
            </label>

            <div className="flex gap-1 rounded-lg  bg-[#101214] p-1">
              {opt.values.map((val) => {
                const selected = config[opt.key] === val;

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setConfig({ [opt.key]: val })}
                    className={`flex-1 min-w-0 px-1.5 py-2 rounded-md text-[10px] sm:text-[11px] font-medium capitalize transition-colors ${selected
                      ? 'bg-[#181C1F] text-[#eab42e] border border-[var(--border-main)] shadow-sm'
                      : 'border border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                  >
                    {formatLabel(val)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Language */}
        <div className="space-y-2">
          <label
            htmlFor="solve-language"
            className="text-xs font-medium text-[var(--text-muted)]"
          >
            Response language
          </label>

          <select
            id="solve-language"
            value={config.language}
            onChange={(e) => setConfig({ language: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-[var(--border-main)] bg-[var(--bg-main)] text-xs text-[var(--text-main)] outline-none cursor-pointer focus:border-[#eab42e]/60"
          >
            {[
              'English',
              'Spanish',
              'French',
              'German',
              'Hindi',
              'Arabic',
              'Chinese',
              'Japanese'
            ].map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

// import React from 'react';
// import { useSolveStore } from '../store/solveStore';

// export default function SolveConfig() {
//   const { config, setConfig } = useSolveStore();

//   const options = [
//     { 
//       label: 'Detail', 
//       key: 'detailLevel', 
//       values: ['short', 'medium', 'detailed'] 
//     },
//     { 
//       label: 'Format', 
//       key: 'style', 
//       values: ['bullet', 'paragraph', 'step-by-step'] 
//     },
//     { 
//       label: 'Difficulty', 
//       key: 'difficulty', 
//       values: ['beginner', 'exam', 'advanced'] 
//     }
//   ];

//   return (
//     <div className="p-5 space-y-4">
//       <div>
//         <h2 className="text-sm font-bold text-[var(--text-main)]">Configuration</h2>
//       </div>

//       <div className="space-y-4">
//         {options.map((opt) => (
//           <div key={opt.key} className="flex items-center justify-between gap-4">
//             <label className="text-xs font-semibold text-[var(--text-muted)] w-16 shrink-0">{opt.label}</label>
//             <div className="flex-1 flex bg-[var(--bg-main)] rounded border border-[var(--border-main)] p-0.5">
//               {opt.values.map((val) => (
//                 <button
//                   key={val}
//                   onClick={() => setConfig({ [opt.key]: val })}
//                   className={`
//                     flex-1 py-1 text-[10px] font-semibold rounded-sm transition-all
//                     ${config[opt.key] === val 
//                       ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm border border-[var(--border-main)]' 
//                       : 'text-[var(--text-muted)] hover:text-[var(--text-main)] border border-transparent'}
//                   `}
//                 >
//                   {val.replace('-', ' ')}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}

//         <div className="flex items-center justify-between gap-4">
//           <label className="text-xs font-semibold text-[var(--text-muted)] w-16 shrink-0">Language</label>
//           <select 
//             value={config.language}
//             onChange={(e) => setConfig({ language: e.target.value })}
//             className="flex-1 bg-[var(--bg-main)] border border-[var(--border-main)] rounded py-1 px-2 text-xs text-[var(--text-main)] outline-none focus:border-primary-500/50 cursor-pointer"
//           >
//             {['English', 'Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese', 'Japanese'].map(lang => (
//               <option key={lang} value={lang}>{lang}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }
