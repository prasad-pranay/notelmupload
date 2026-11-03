
import React, { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import {motion} from "framer-motion";
import {
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineStar,
  HiOutlineServer,
  HiOutlineArrowUpTray,
  HiOutlineMagnifyingGlass,
  HiOutlineListBullet,
  HiOutlineSquares2X2,
  HiOutlineChartBar,
  HiOutlineArrowDownTray,
  HiOutlineEllipsisVertical,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocument,
  HiOutlinePhoto,
  HiOutlinePresentationChartBar
} from 'react-icons/hi2';

import api from '../api/axios.js';
import toast from 'react-hot-toast';

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const ACCENT = '#eab42e';

function getExtension(doc) {
  const type = String(doc.fileType || '').toLowerCase();
  const titleExtension = String(doc.title || '').split('.').pop().toLowerCase();

  if (type.includes('pdf')) return 'pdf';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'pptx';
  if (type.includes('word')) return 'docx';
  if (type.includes('image')) return 'image';
  if (['pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'].includes(type)) {
    return type;
  }

  return ['pdf', 'ppt', 'pptx', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'webp'].includes(titleExtension)
    ? titleExtension
    : type || 'file';
}

function getTypeStyle(type) {
  switch (type) {
    case 'pdf':
      return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    case 'ppt':
    case 'pptx':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'doc':
    case 'docx':
      return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
    case 'txt':
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'image':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
      return 'text-violet-400 bg-violet-400/10 border-violet-400/20';
    default:
      return 'text-[var(--text-muted)] bg-[var(--bg-main)] border-[var(--border-main)]';
  }
}

function getFileIcon(type) {
  if (type === 'image' || ['png', 'jpg', 'jpeg', 'webp'].includes(type)) {
    return HiOutlinePhoto;
  }

  if (type === 'ppt' || type === 'pptx') {
    return HiOutlinePresentationChartBar;
  }

  return HiOutlineDocumentText;
}

function formatBytes(bytes = 0) {
  if (!bytes || bytes <= 0) return '—';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function timeAgo(dateString) {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function formatDate(dateString) {
  if (!dateString) return '—';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const filters = [
  'All documents',
  'PDF',
  'PPT',
  'DOCX',
  'TXT',
  'Images'
];

function matchesFilter(doc, filter) {
  if (filter === 'All documents') return true;

  const type = getExtension(doc);

  if (filter === 'PPT') return ['ppt', 'pptx'].includes(type);
  if (filter === 'DOCX') return ['doc', 'docx'].includes(type);
  if (filter === 'Images') {
    return ['image', 'png', 'jpg', 'jpeg', 'webp'].includes(type);
  }

  return type === filter.toLowerCase();
}

// --------------------------------------------------
// Small UI components
// --------------------------------------------------
function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="relative min-w-0 p-3.5 sm:p-4 xl:p-5 transition-colors duration-200 hover:bg-white/[0.015]">
      {/* Inset separator */}
      <div className="absolute right-0 top-3 bottom-3 w-px bg-[#34393b] xl:hidden" />

      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-light text-[var(--text-muted)]">
          {label}
        </span>

        {/* <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg border border-[#292f31] bg-[#0b0d0e] text-[#eab42e]"> */}
          <Icon size={20} className="text-[#eab42e]" />
      </div>

      <p className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text-main)] tabular-nums">
        {value}
      </p>

      {detail && (
        <p className="mt-1 uppercase text-[8px] tracking-wider text-[var(--text-muted)] truncate">
          {detail}
        </p>
      )}
    </div>
  );
}

function FileIcon({ type }) {
  const Icon = getFileIcon(type);

  return (
    <div className="w-10 h-10 shrink-0 rounded-lg border border-[var(--border-main)] bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-muted)]">
      <Icon size={19} />
    </div>
  );
}

function TypeBadge({ type }) {
  const label = type === 'image' ? 'Image' : type.toUpperCase();

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[9px] font-semibold tracking-wide ${getTypeStyle(type)}`}>
      {label}
    </span>
  );
}

function EmptyState({ hasSearch, onReset }) {
  return (
    <div className="py-20 px-5 flex flex-col items-center text-center">
        <HiOutlineFolder size={40} strokeWidth={1} className='text-[var(--text-muted)]' />

      <h3 className="mt-4 text-sm font-light text-[var(--text-main)]">
        {hasSearch ? 'No matching documents' : 'No documents yet'}
      </h3>

      <p className="max-w-xs mt-1.5 text-[9px] uppercase leading-relaxed text-[var(--text-muted)]">
        {hasSearch
          ? 'Try a different search or file type.'
          : 'Upload your study materials to keep everything organized in one place.'}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 text-xs font-semibold text-black px-6 rounded-sm cursor-pointer py-3 bg-[#eab42e] hover:bg-[#f3c44f] transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

// --------------------------------------------------
// Main page
// --------------------------------------------------

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All documents');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list');
  const [openMenu, setOpenMenu] = useState(null);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch documents
  const {
    data: documents = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then((res) => res.data.data || [])
  });

  // Delete document
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/documents/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted');
      setOpenMenu(null);
    },

    onError: () => {
      toast.error('Could not delete document');
    }
  });

  // Upload documents
  const onDrop = useCallback(async (files) => {
    if (!files.length) return;

    setUploading(true);

    let successful = 0;
    let failed = 0;

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

        try {
          await api.post('/documents/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          successful += 1;
        } catch (error) {
          failed += 1;
          console.error(`Upload failed: ${file.name}`, error);
        }
      }

      if (successful > 0) {
        toast.success(
          successful === 1
            ? 'Document uploaded successfully'
            : `${successful} documents uploaded`
        );
      }

      if (failed > 0) {
        toast.error(`${failed} file${failed > 1 ? 's' : ''} could not be uploaded`);
      }

      await queryClient.invalidateQueries({ queryKey: ['documents'] });
    } finally {
      setUploading(false);
    }
  }, [queryClient]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open
  } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    }
  });

  // Stats
  const totalStorage = documents.reduce(
    (total, doc) => total + (Number(doc.size) || 0),
    0
  );

  const recentCount = documents.filter((doc) => {
    const date = new Date(doc.createdAt);
    if (Number.isNaN(date.getTime())) return false;

    const days = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 7;
  }).length;

  const fileTypeCount = new Set(documents.map(getExtension)).size;

  // Filter + search + sort
  const filteredDocs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = documents.filter((doc) => {
      const title = String(doc.title || '').toLowerCase();
      const matchesSearch = !search || title.includes(search);
      return matchesSearch && matchesFilter(doc, activeFilter);
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return String(a.title || '').localeCompare(String(b.title || ''));
      }

      if (sortBy === 'size') {
        return (Number(b.size) || 0) - (Number(a.size) || 0);
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [documents, searchTerm, activeFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const paginatedDocs = filteredDocs.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const startIndex = filteredDocs.length ? (safePage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(safePage * itemsPerPage, filteredDocs.length);

  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilter('All documents');
    setCurrentPage(1);
  };

  const handleDelete = (doc) => {
    const confirmed = window.confirm(`Delete "${doc.title}"? This cannot be undone.`);
    if (confirmed) deleteMut.mutate(doc._id);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-[#0B0D0F] text-[var(--text-main)]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  {/* Page heading */}
  <div className="min-w-0">
    <h1 className="text-[23px] font-semibold tracking-[-0.035em] text-[var(--text-main)] sm:text-[26px]">
      Documents
    </h1>

    <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
      Your study materials, organized in one place.
    </p>
  </div>

  {/* Upload area */}
  <section
    {...getRootProps()}
    className={`group relative w-full cursor-pointer overflow-hidden rounded-lg border transition-colors duration-200 sm:max-w-[390px] ${
      isDragActive
        ? 'border-[#eab42e]/60 bg-[#eab42e]/[0.05]'
        : 'border-[#292f31] bg-[#101314] hover:border-[#454b49] hover:bg-[#121617]'
    }`}
  >
    <input {...getInputProps()} />

    <div className="flex items-center gap-3 px-3.5 py-3.5">

      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
          isDragActive
            ? 'bg-[#eab42e]/10 text-[#eab42e]'
            : 'bg-[#1b2020] text-[#bda052] group-hover:bg-[#242724]'
        }`}
      >
        <HiOutlineArrowUpTray size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-[#e5e7e3]">
          {isDragActive ? 'Drop files to upload' : 'Add documents'}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-[#788183]">
          PDF, DOCX, PPT, TXT and images
        </p>
      </div>

      <span className="shrink-0 text-[10px] font-medium text-[#bda052] transition-colors group-hover:text-[#eab42e]">
        Browse
      </span>
    </div>

    {uploading && (
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 bg-[#101314]/95 backdrop-blur-[2px]">
        <span className="size-4 animate-spin rounded-full border-2 border-[#343a3c] border-t-[#eab42e]" />
        <span className="text-xs font-medium text-[#e8e9e6]">
          Uploading files...
        </span>
      </div>
    )}
  </section>
</div>
          {/* <motion.button
  type="button"
  onClick={open}
  disabled={uploading}
  whileHover={!uploading ? { y: -2 } : {}}
  whileTap={!uploading ? { scale: 0.985 } : {}}
  className="
    group relative flex w-max items-center justify-center gap-3
    overflow-hidden rounded-xl
    border border-[#eab42e]/50
    bg-[#eab42e] px-6 py-7
    text-[#17140c]
    transition-all duration-300 ease-out
    hover:border-[#f3c653]
    hover:bg-[#f0bd3f]
    hover:shadow-[0_8px_24px_rgba(234,180,46,0.13)]
    disabled:cursor-not-allowed disabled:opacity-50
  "
>
  <span className="
    flex h-9 w-9 items-center justify-center
    rounded-lg border border-[#17140c]/15
    bg-[#17140c]/[0.06]
    transition-transform duration-300
    group-hover:-translate-y-0.5
  ">
    <HiOutlineArrowUpTray size={19} strokeWidth={1.8} />
  </span>

  <span className="flex flex-col items-start gap-0.5">
    <span className="text-[13px] font-semibold tracking-[-0.02em]">
      {uploading ? 'Uploading documents...' : 'Add documents'}
    </span>
    <span className="text-[10px] font-medium text-[#17140c]/60">
      Upload files to your notebook
    </span>
  </span>

  <HiOutlineArrowUpTray
    size={15}
    className="
      ml-auto opacity-40
      transition-all duration-300
      group-hover:-translate-y-0.5
      group-hover:translate-x-0.5
      group-hover:opacity-80
    "
  />
</motion.button> */}

        {/* Stats */}
        <section className="grid grid-cols-2 xl:grid-cols-4 mb-5 rounded-xl border border-[#202426] bg-[#101214] overflow-hidden divide-x divide-y xl:divide-y-0 divide-[#292f31]">
  <StatCard
    icon={HiOutlineDocumentText}
    label="Documents"
    value={documents.length}
    detail="Total in your library"
  />

  <StatCard
    icon={HiOutlineServer}
    label="Storage used"
    value={formatBytes(totalStorage)}
    detail="Across all uploaded files"
  />

  <StatCard
    icon={HiOutlineClock}
    label="Recently added"
    value={recentCount}
    detail="Added in the last 7 days"
  />

  <StatCard
    icon={HiOutlineFolder}
    label="File types"
    value={fileTypeCount}
    detail="Different formats stored"
  />
</section>


         

        {/* Document library */}
        <section className="overflow-hidden rounded-xl border border-[#252a2c] bg-[#101314]">

  {/* Toolbar */}
  <div className="border-b border-[#252a2c] px-4 py-4 sm:px-5">
    <div className="flex flex-col gap-4">

      {/* Heading and controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold tracking-tight text-[#e8e9e6]">
              All documents
            </h2>
            <p className="mt-1 text-[11px] text-[#788183]">
              {filteredDocs.length} {filteredDocs.length === 1 ? 'document' : 'documents'}
            </p>
          </div>

          {/* Mobile view controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <ViewButton
              active={viewMode === 'list'}
              label="List view"
              onClick={() => setViewMode('list')}
            >
              <HiOutlineListBullet size={16} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'grid'}
              label="Grid view"
              onClick={() => setViewMode('grid')}
            >
              <HiOutlineSquares2X2 size={16} />
            </ViewButton>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <HiOutlineMagnifyingGlass
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#737d7f]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search documents..."
              className="h-9 w-full rounded-lg border border-[#292f31] bg-[#0b0d0e] pl-9 pr-3 text-xs text-[#e8e9e6] outline-none transition-colors placeholder:text-[#626c6e] hover:border-[#394143] focus:border-[#a98a3d]/60"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort documents"
              className="h-9 min-w-0 flex-1 cursor-pointer rounded-lg border border-[#292f31] bg-[#0b0d0e] px-3 text-[11px] text-[#aeb5b4] outline-none transition-colors hover:border-[#394143] focus:border-[#a98a3d]/60 sm:flex-none"
            >
              <option value="recent">Most recent</option>
              <option value="name">Name</option>
              <option value="size">File size</option>
            </select>

            {/* Desktop view controls */}
            <div className="hidden h-9 items-center gap-0.5 rounded-lg border border-[#292f31] bg-[#0b0d0e] p-1 lg:flex">
              <ViewButton
                active={viewMode === 'list'}
                label="List view"
                onClick={() => setViewMode('list')}
              >
                <HiOutlineListBullet size={16} />
              </ViewButton>
              <ViewButton
                active={viewMode === 'grid'}
                label="Grid view"
                onClick={() => setViewMode('grid')}
              >
                <HiOutlineSquares2X2 size={16} />
              </ViewButton>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 scrollbar-none">
        {filters.map((filter) => {
          const active = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className={`relative shrink-0 px-2.5 py-1.5 text-[11px] transition-colors duration-150 ${
                active
                  ? 'font-medium text-[#d8b65d]'
                  : 'text-[#7e898a] hover:text-[#d6d9d6]'
              }`}
            >
              {filter}
              {active && (
                <span className="absolute inset-x-2.5 bottom-0 h-px bg-[#c6a44e]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>

  {/* Loading */}
  {isLoading ? (
    <div className="flex min-h-52 flex-col items-center justify-center">
      <span className="size-5 animate-spin rounded-full border-2 border-[#303638] border-t-[#c6a44e]" />
      <p className="mt-3 text-[11px] text-[#7e898a]">
        Loading documents...
      </p>
    </div>
  ) : isError ? (
    <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
      <p className="text-[13px] font-medium text-[#e8e9e6]">
        Couldn't load your documents
      </p>
      <button
        type="button"
        onClick={() => refetch()}
        className="mt-2 text-[11px] font-medium text-[#c6a44e] transition-colors hover:text-[#e0c16f]"
      >
        Try again
      </button>
    </div>
  ) : filteredDocs.length === 0 ? (
    <EmptyState
      hasSearch={Boolean(searchTerm || activeFilter !== 'All documents')}
      onReset={resetFilters}
    />
  ) : viewMode === 'list' ? (

    /* List view */
    <div className="w-full overflow-x-auto">
      <div className="min-w-[680px]">

        <div className="grid grid-cols-[minmax(240px,2.5fr)_0.8fr_0.8fr_1fr_76px] items-center gap-4 border-b border-[#252a2c] px-5 py-3 text-[9px] font-medium uppercase tracking-[0.1em] text-[#687375]">
          <span>Name</span>
          <span>Type</span>
          <span>Size</span>
          <span>Added</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-[#202527]">
          {paginatedDocs.map((doc) => {
            const type = getExtension(doc);

            return (
              <div
                key={doc._id}
                className="group grid grid-cols-[minmax(240px,2.5fr)_0.8fr_0.8fr_1fr_76px] items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-white/[0.018]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon type={type} />

                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#dfe2df] transition-colors group-hover:text-white">
                      {doc.title}
                    </p>
                    <p className="mt-1 text-[10px] text-[#707b7d]">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <TypeBadge type={type} />
                </div>

                <p className="text-[11px] tabular-nums text-[#899293]">
                  {doc.readableSize || formatBytes(doc.size)}
                </p>

                <div>
                  <p className="text-[11px] text-[#c2c8c5]">
                    {timeAgo(doc.createdAt)}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/workspace/${doc._id}`)}
                    title="Open workspace"
                    aria-label={`Open ${doc.title}`}
                    className="flex size-7 items-center justify-center rounded-md text-[#778183] transition-colors hover:bg-[#c6a44e]/[0.08] hover:text-[#d8b65d]"
                  >
                    <HiOutlineChartBar size={15} />
                  </button>

                  <DocumentMenu
                    doc={doc}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    handleDelete={handleDelete}
                    deleteMut={deleteMut}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (

    /* Grid view */
    <div className="grid grid-cols-1 gap-px bg-[#252a2c] sm:grid-cols-2 xl:grid-cols-3">
      {paginatedDocs.map((doc) => {
        const type = getExtension(doc);

        return (
          <article
            key={doc._id}
            className="group min-w-0 bg-[#101314] p-4 transition-colors duration-150 hover:bg-[#141819]"
          >
            <div className="flex items-start justify-between gap-3">
              <FileIcon type={type} />

              <DocumentMenu
                doc={doc}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                handleDelete={handleDelete}
                deleteMut={deleteMut}
              />
            </div>

            <div className="mt-4 min-w-0">
              <h3 className="truncate text-xs font-medium text-[#dfe2df] transition-colors group-hover:text-white">
                {doc.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <TypeBadge type={type} />
                <span className="text-[10px] text-[#7d8889]">
                  {doc.readableSize || formatBytes(doc.size)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#252a2c] pt-3">
              <span className="text-[10px] text-[#778183]">
                {timeAgo(doc.createdAt)}
              </span>

              <button
                type="button"
                onClick={() => navigate(`/workspace/${doc._id}`)}
                className="text-[10px] font-medium text-[#bda052] transition-colors hover:text-[#e0c16f]"
              >
                Open workspace
              </button>
            </div>
          </article>
        );
      })}
    </div>
  )}

  {/* Pagination */}
  {!isLoading && !isError && filteredDocs.length > 0 && (
    <footer className="flex flex-col gap-3 border-t border-[#252a2c] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-[10px] text-[#778183]">
        Showing{' '}
        <span className="font-medium tabular-nums text-[#d4d9d5]">
          {startIndex}–{endIndex}
        </span>
        {' '}of{' '}
        <span className="font-medium tabular-nums text-[#d4d9d5]">
          {filteredDocs.length}
        </span>
      </p>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <label className="flex items-center gap-2 text-[10px] text-[#778183]">
          Per page
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-7 rounded-md border border-[#292f31] bg-[#0b0d0e] px-2 text-[10px] text-[#c2c8c5] outline-none focus:border-[#a98a3d]/60"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safePage <= 1}
            aria-label="Previous page"
            className="flex size-7 items-center justify-center rounded-md text-[#899293] transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <HiOutlineChevronLeft size={15} />
          </button>

          <span className="min-w-12 text-center text-[10px] tabular-nums text-[#899293]">
            {safePage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safePage >= totalPages}
            aria-label="Next page"
            className="flex size-7 items-center justify-center rounded-md text-[#899293] transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <HiOutlineChevronRight size={15} />
          </button>
        </div>
      </div>
    </footer>
  )}
</section>
      </div>
    </div>
  );
}

function ViewButton({ active, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex size-7 items-center justify-center rounded-md transition-colors ${
        active
          ? 'bg-[#202526] text-[#d8b65d]'
          : 'text-[#758082] hover:bg-white/[0.04] hover:text-[#dfe2df]'
      }`}
    >
      {children}
    </button>
  );
}

function DocumentMenu({
  doc,
  openMenu,
  setOpenMenu,
  handleDelete,
  deleteMut,
}) {
  const isOpen = openMenu === doc._id;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : doc._id)}
        aria-label={`More actions for ${doc.title}`}
        aria-expanded={isOpen}
        className={`flex size-7 items-center justify-center rounded-md transition-colors ${
          isOpen
            ? 'bg-white/[0.05] text-[#dfe2df]'
            : 'text-[#778183] hover:bg-white/[0.05] hover:text-[#dfe2df]'
        }`}
      >
        <HiOutlineEllipsisVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-1 w-40 rounded-lg border border-[#303638] bg-[#15191a] p-1 shadow-xl shadow-black/30">
          <button
            type="button"
            onClick={() => {
              setOpenMenu(null);
              handleDelete(doc);
            }}
            disabled={deleteMut.isPending}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[11px] text-[#d58c86] transition-colors hover:bg-[#d58c86]/[0.08] disabled:opacity-50"
          >
            <HiOutlineTrash size={14} />
            Delete document
          </button>
        </div>
      )}
    </div>
  );
}

// import React, { useState, useCallback } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useDropzone } from 'react-dropzone';
// import {
//   HiOutlineDocumentText,
//   HiOutlineFolder,
//   HiOutlineStar,
//   HiOutlineServer,
//   HiOutlineArrowUpTray,
//   HiOutlineMagnifyingGlass,
//   HiOutlineListBullet,
//   HiOutlineSquares2X2,
//   HiOutlineChartBar,
//   HiOutlineArrowDownTray,
//   HiOutlineEllipsisVertical,
//   HiOutlineTrash
// } from 'react-icons/hi2';
// import api from '../api/axios.js';
// import toast from 'react-hot-toast';

// // Helper to calculate time ago
// function timeAgo(dateString) {
//   const date = new Date(dateString);
//   const now = new Date();
//   const seconds = Math.round((now - date) / 1000);
//   const minutes = Math.round(seconds / 60);
//   const hours = Math.round(minutes / 60);
//   const days = Math.round(hours / 24);

//   if (seconds < 60) return 'Just now';
//   if (minutes < 60) return `${minutes} minutes ago`;
//   if (hours < 24) return `${hours} hours ago`;
//   if (days === 1) return '1 day ago';
//   if (days < 7) return `${days} days ago`;
//   const weeks = Math.round(days / 7);
//   if (weeks === 1) return '1 week ago';
//   return `${weeks} weeks ago`;
// }

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     month: 'short', day: 'numeric', year: 'numeric'
//   });
// }

// function getTypeColors(type) {
//   switch (type.toLowerCase()) {
//     case 'pdf': return 'text-red-500 border-red-500/30 bg-red-500/10';
//     case 'pptx': case 'ppt': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
//     case 'docx': case 'doc': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
//     case 'txt': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
//     default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
//   }
// }

// export default function DocumentsPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeFilter, setActiveFilter] = useState('All Documents');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [uploading, setUploading] = useState(false);

//   const queryClient = useQueryClient();

//   const { data: documents = [], isLoading } = useQuery({
//     queryKey: ['documents'],
//     queryFn: () => api.get('/documents').then((r) => r.data.data),
//   });

//   const deleteMut = useMutation({
//     mutationFn: (id) => api.delete(`/documents/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['documents'] });
//       toast.success('Document deleted successfully');
//     },
//   });

//   const onDrop = useCallback(async (files) => {
//     setUploading(true);
//     for (const file of files) {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
//       try {
//         await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//         toast.success(`"${file.name}" uploaded successfully`);
//       } catch (err) {
//         toast.error(`Upload failed for ${file.name}`);
//       }
//     }
//     queryClient.invalidateQueries({ queryKey: ['documents'] });
//     setUploading(false);
//   }, [queryClient]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { 
//       'application/pdf': ['.pdf'], 
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx', '.pptx'], 
//       'text/plain': ['.txt'] 
//     },
//   });

//   // Derived Stats
//   const totalStorage = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);
//   const storageGB = (totalStorage / (1024 * 1024 * 1024)).toFixed(1);
//   const storageMB = (totalStorage / (1024 * 1024)).toFixed(1);
//   const displayStorage = storageGB > 0.1 ? `${storageGB} GB` : `${storageMB} MB`;
  
//   const recentlyAdded = documents.filter(doc => {
//     const diffTime = Math.abs(new Date() - new Date(doc.createdAt));
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
//     return diffDays <= 7;
//   }).length;

//   // Filtering
//   const filters = ['All Documents', 'PDF', 'PPT', 'DOCX', 'TXT', 'Images'];
//   const filteredDocs = documents.filter(doc => {
//     const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = activeFilter === 'All Documents' || doc.fileType.toLowerCase().includes(activeFilter.toLowerCase());
//     return matchesSearch && matchesFilter;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
//   const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const startIdx = (currentPage - 1) * itemsPerPage + 1;
//   const endIdx = Math.min(currentPage * itemsPerPage, filteredDocs.length);

//   return (
//     <div className="min-h-screen p-8 max-w-[1600px] mx-auto text-[#E2E8F0]">
      
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Your Documents</h1>
//         <p className="text-[#94A3B8] text-sm">Manage and organize all your study materials in one place.</p>
//       </div>

//       {/* Stats & Upload Row */}
//       <div className="flex flex-col xl:flex-row gap-6 mb-8">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
//           {/* Total Docs */}
//           <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#1A253C] flex items-center justify-center">
//               <HiOutlineDocumentText className="text-[#3B82F6] w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-white leading-none">{documents.length}</p>
//               <p className="text-xs font-medium text-[#64748B] mt-1">Total Documents</p>
//             </div>
//           </div>
//           {/* Storage */}
//           <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#132A24] flex items-center justify-center">
//               <HiOutlineServer className="text-[#10B981] w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-white leading-none">{displayStorage}</p>
//               <p className="text-xs font-medium text-[#64748B] mt-1">Total Storage Used</p>
//             </div>
//           </div>
//           {/* Folders */}
//           <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#2D1B4E] flex items-center justify-center">
//               <HiOutlineFolder className="text-[#8B5CF6] w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-white leading-none">3</p>
//               <p className="text-xs font-medium text-[#64748B] mt-1">Folders</p>
//             </div>
//           </div>
//           {/* Recently Added */}
//           <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-5 flex flex-col justify-center items-start gap-3">
//             <div className="w-10 h-10 rounded-xl bg-[#322315] flex items-center justify-center">
//               <HiOutlineStar className="text-[#F59E0B] w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-white leading-none">{recentlyAdded}</p>
//               <p className="text-xs font-medium text-[#64748B] mt-1">Recently Added</p>
//             </div>
//           </div>
//         </div>

//         {/* Upload Box */}
//         <div 
//           {...getRootProps()}
//           className={`
//             xl:w-[450px] border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden
//             ${isDragActive ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-[#2A303C] bg-[#111318] hover:border-[#3A404C]'}
//           `}
//         >
//           <input {...getInputProps()} />
//           <HiOutlineArrowUpTray className="w-6 h-6 text-[#3B82F6] mb-3" />
//           <h3 className="text-sm font-bold text-white mb-1">Upload Documents</h3>
//           <p className="text-xs text-[#64748B]">Drag & drop your files here or <span className="text-[#3B82F6] hover:underline">click to browse</span></p>
//           <p className="text-[10px] text-[#475569] mt-3">Supports PDF, PPT, DOCX, TXT & more</p>
          
//           {uploading && (
//              <div className="absolute inset-0 bg-[#111318]/90 backdrop-blur-sm flex flex-col items-center justify-center">
//                <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-2" />
//                <p className="text-xs font-bold text-[#3B82F6]">Uploading...</p>
//              </div>
//           )}
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="bg-[#111318] border border-[#1E222A] rounded-2xl p-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
//         <div className="flex flex-wrap items-center gap-2">
//           {filters.map(filter => (
//             <button
//               key={filter}
//               onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
//               className={`
//                 px-4 py-1.5 rounded-lg text-xs font-bold transition-all
//                 ${activeFilter === filter 
//                   ? 'bg-[#1A253C] border border-[#3B82F6]/30 text-[#3B82F6]' 
//                   : 'bg-transparent border border-transparent text-[#94A3B8] hover:bg-[#1E222A] hover:text-white'}
//               `}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>

//         <div className="flex flex-wrap items-center gap-4">
//           <div className="relative">
//             <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
//             <input 
//               type="text"
//               placeholder="Search documents..."
//               value={searchTerm}
//               onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//               className="bg-[#0B0C10] border border-[#1E222A] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#64748B] outline-none focus:border-[#3B82F6]/50 w-full sm:w-64 transition-colors"
//             />
//           </div>
          
//           <div className="flex items-center gap-2">
//             <select className="bg-[#0B0C10] border border-[#1E222A] rounded-xl py-2 px-3 text-xs text-[#94A3B8] font-medium outline-none appearance-none cursor-pointer hover:border-[#3A404C] transition-colors">
//               <option>Sort by: Recent</option>
//               <option>Sort by: Name</option>
//               <option>Sort by: Size</option>
//             </select>
//           </div>

//           <div className="flex items-center gap-1 bg-[#0B0C10] border border-[#1E222A] rounded-xl p-1">
//             <button className="p-1.5 rounded-lg bg-[#1E222A] text-white transition-colors"><HiOutlineListBullet className="w-4 h-4" /></button>
//             <button className="p-1.5 rounded-lg text-[#64748B] hover:text-white transition-colors"><HiOutlineSquares2X2 className="w-4 h-4" /></button>
//           </div>
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="bg-[#111318] border border-[#1E222A] rounded-2xl overflow-hidden flex flex-col">
//         {/* Table Header */}
//         <div className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_1fr] gap-4 px-8 py-5 border-b border-[#1E222A] text-[10px] font-black text-[#64748B] uppercase tracking-[0.1em]">
//           <div>Name</div>
//           <div>Type</div>
//           <div>Size</div>
//           <div>Uploaded</div>
//           <div className="text-right pr-4">Actions</div>
//         </div>

//         {/* Table Body */}
//         <div className="divide-y divide-[#1E222A]">
//           {isLoading ? (
//              <div className="py-24 flex justify-center">
//                 <div className="w-8 h-8 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
//              </div>
//           ) : paginatedDocs.length === 0 ? (
//              <div className="py-24 text-center text-[#64748B] text-sm font-medium">
//                 No documents found matching your criteria.
//              </div>
//           ) : (
//             paginatedDocs.map(doc => {
//               const typeStyle = getTypeColors(doc.fileType);
//               // Extract colors for the custom document icon
//               const iconTextColor = typeStyle.split(' ')[0]; // e.g. text-red-500
//               const iconBorderColor = iconTextColor.replace('text-', 'border-'); 

//               return (
//                 <div key={doc._id} className="grid grid-cols-[2.5fr_1fr_1fr_1.5fr_1fr] gap-4 px-8 py-5 items-center hover:bg-[#15181E] transition-colors group">
                  
//                   {/* Name Column */}
//                   <div className="flex items-center gap-5 min-w-0">
//                     <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm relative">
//                       <div className={`w-6 h-[26px] rounded-[3px] border-[2px] ${iconBorderColor} flex flex-col items-center justify-end pb-[2px] relative bg-white`}>
//                          <div className={`absolute -top-[2px] -right-[2px] w-2.5 h-2.5 bg-white border-l-[2px] border-b-[2px] ${iconBorderColor} rounded-bl-[3px]`} />
//                          <span className={`text-[5px] font-black uppercase ${iconTextColor}`}>{doc.fileType}</span>
//                       </div>
//                     </div>
//                     <div className="min-w-0">
//                       <h4 className="text-sm font-bold text-white truncate flex items-center gap-2">
//                         {doc.title}
//                         {doc.title.length % 2 === 0 && <HiOutlineStar className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />}
//                       </h4>
//                       <p className="text-[11px] text-[#64748B] truncate mt-1">Uploaded in General</p>
//                     </div>
//                   </div>

//                   {/* Type Column */}
//                   <div>
//                     <span className={`px-2.5 py-1 rounded-[4px] text-[9px] font-black uppercase tracking-widest border ${typeStyle}`}>
//                       {doc.fileType}
//                     </span>
//                   </div>

//                   {/* Size Column */}
//                   <div className="text-xs font-semibold text-[#94A3B8]">
//                     {doc.readableSize}
//                   </div>

//                   {/* Uploaded Column */}
//                   <div className="text-xs font-semibold text-[#94A3B8]">
//                     <p className="text-[#E2E8F0] mb-0.5">{timeAgo(doc.createdAt)}</p>
//                     <p className="text-[#64748B]">{formatDate(doc.createdAt)}</p>
//                   </div>

//                   {/* Actions Column */}
//                   <div className="flex items-center justify-end gap-2 pr-2">
//                     <button 
//                       onClick={() => window.location.href = `/workspace/${doc._id}`}
//                       className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors"
//                       title="Analytics / Workspace"
//                     >
//                       <HiOutlineChartBar className="w-[18px] h-[18px]" />
//                     </button>
//                     <button 
//                       className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors"
//                       title="Download"
//                     >
//                       <HiOutlineArrowDownTray className="w-[18px] h-[18px]" />
//                     </button>
//                     <div className="relative group/menu">
//                       <button className="p-2 rounded-lg bg-[#1E222A] hover:bg-[#2A303C] text-[#94A3B8] hover:text-white transition-colors">
//                         <HiOutlineEllipsisVertical className="w-[18px] h-[18px]" />
//                       </button>
//                       <div className="absolute right-0 top-full mt-2 w-36 bg-[#1E222A] border border-[#2A303C] rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 py-1.5">
//                          <button 
//                             onClick={() => deleteMut.mutate(doc._id)}
//                             className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
//                          >
//                             <HiOutlineTrash className="w-4 h-4" /> Delete
//                          </button>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Pagination Footer */}
//         <div className="px-8 py-5 border-t border-[#1E222A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#64748B]">
//           <div>
//             Showing {filteredDocs.length > 0 ? startIdx : 0} to {endIdx} of {filteredDocs.length} documents
//           </div>
          
//           <div className="flex flex-wrap items-center gap-6">
//             <div className="flex items-center gap-1.5">
//                <button 
//                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                  disabled={currentPage === 1}
//                  className="p-1 hover:text-white disabled:opacity-30 transition-colors"
//                >
//                  &lt;
//                </button>
//                {Array.from({length: totalPages}, (_, i) => (
//                  <button 
//                    key={i}
//                    onClick={() => setCurrentPage(i + 1)}
//                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-[#1A253C] text-[#3B82F6] border border-[#3B82F6]/30 font-bold' : 'hover:bg-[#1E222A] hover:text-white'}`}
//                  >
//                    {i + 1}
//                  </button>
//                ))}
//                <button 
//                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                  disabled={currentPage === totalPages || totalPages === 0}
//                  className="p-1 hover:text-white disabled:opacity-30 transition-colors"
//                >
//                  &gt;
//                </button>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <span>Documents per page:</span>
//               <select 
//                 value={itemsPerPage}
//                 onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
//                 className="bg-transparent text-white font-bold outline-none cursor-pointer"
//               >
//                 <option value={5} className="bg-[#111318]">5</option>
//                 <option value={10} className="bg-[#111318]">10</option>
//                 <option value={20} className="bg-[#111318]">20</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }
