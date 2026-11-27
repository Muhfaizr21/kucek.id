import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 8, 12, 20],
  itemLabel = 'data',
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 mt-3 border-t border-slate-100 text-xs">
      <div className="flex items-center gap-3 text-slate-500 font-medium">
        <span>
          Menampilkan <b className="text-slate-800">{startItem}</b>–
          <b className="text-slate-800">{endItem}</b> dari{' '}
          <b className="text-slate-800">{totalItems}</b> {itemLabel}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">•</span>
            <span className="text-[11px] text-slate-400">Baris:</span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              {pageSizeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onPageSizeChange(opt);
                    onPageChange(1);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold transition cursor-pointer ${
                    pageSize === opt
                      ? 'bg-white text-[#2563EB] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-extrabold transition cursor-pointer ${
              p === safePage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
