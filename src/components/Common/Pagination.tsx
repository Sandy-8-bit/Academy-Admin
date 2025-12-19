import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages.filter((p) => p >= 1 && p <= totalPages);
  };

  const showLeftEllipsis = currentPage > 2;
  const showRightEllipsis = currentPage < totalPages - 1;

  return (
    <div className="flex min-w-max scale-90 flex-wrap items-center justify-center gap-2 sm:gap-3 md:scale-95 lg:scale-100">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`cursor-pointer rounded-full bg-white px-2 py-2 shadow-sm transition ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400"
            : "text-slate-800 hover:bg-gray-200"
        }`}
      >
        <img src="/icons/arrow-icon.svg" alt="Previous" className="h-4 w-4 rotate-90" />
      </button>

      {/* Left Ellipsis */}
      {showLeftEllipsis && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="xs:block hidden rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
          >
            1
          </button>
          <span className="xs:inline hidden px-1 text-gray-500">...</span>
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`rounded px-3 py-1 text-sm transition ${
            currentPage === n
              ? "bg-[#10442A] text-white"
              : "bg-white text-gray-700 shadow-sm hover:bg-gray-200"
          }`}
        >
          {n}
        </button>
      ))}

      {/* Right Ellipsis */}
      {showRightEllipsis && (
        <>
          <span className="xs:inline hidden px-1 text-gray-500">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="xs:block hidden rounded px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`cursor-pointer rounded-full bg-white px-2 py-2 shadow-sm transition ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-400"
            : "text-slate-800 hover:bg-gray-200"
        }`}
      >
       <img src="/icons/arrow-icon.svg" alt="Previous" className="h-4 w-4 rotate-270" />
      </button>
    </div>
  );
};

export default PaginationControls;
