/* eslint-disable @typescript-eslint/no-explicit-any */
// GenericTable.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Replace these with your actual components paths if different
import SearchSm from "../Common/SearchSm";
import ButtonSm from "./Buttons";
import DropdownSelect from "./DropDown";
import PaginationControls from "./Pagination";
import { Edit2, EyeIcon, Trash2 } from "lucide-react";

/* Small shimmer box used in skeleton rows */
const shimmer = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: { duration: 1.2, repeat: Infinity },
  },
};
const ShimmerBox = ({ className }: { className?: string }) => (
  <motion.div
    className={`relative overflow-hidden rounded bg-gray-200 ${
      className ?? ""
    }`}
    variants={shimmer}
    initial="initial"
    animate="animate"
  >
    <motion.div
      className="absolute top-0 left-[-50%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent"
      animate={{ left: ["-50%", "100%"] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

/**
 * DataCell:
 * - headingTitle: column label
 * - accessVar: either 'branch' or 'branch[1]' or a function (row=>value)
 * - isArray: if true and value is an array, table will automatically use value[1]
 * - render: (value, row, index) => ReactNode  <-- value is already resolved
 */
export type DataCell = {
  headingTitle: string;
  accessVar?: string | ((row: any) => any);
  className?: string;
  sortable?: boolean;
  searchable?: boolean;
  isArray?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
};

export interface GenericTableProps {
  data: any[] | { records: any[]; totalRecords?: number };
  dataCell: DataCell[];
  isLoading?: boolean;
  isHeaderVisible?: boolean;
  isMasterTable?: boolean;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  noDataMsg?: string;
  newItemLink?: string;
  actionWidth?: number | null;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  skeletonRows?: number;
  tableTitle?: string;
  className?: string;
  rowKey?: (row: any, index: number) => string | number;
  isSelectable?: boolean;
  selectedRowIndices?: number[];
  onSelectionChange?: (selectedIndices: number[], selectedRows: any[]) => void;
}

function toRecords(input: any): { records: any[]; totalRecords?: number } {
  if (!input) return { records: [], totalRecords: 0 };
  if (Array.isArray(input))
    return { records: input, totalRecords: input.length };
  return {
    records: input.records || [],
    totalRecords: input.totalRecords ?? input.records?.length ?? 0,
  };
}

// resolves accessVar like 'address.city' or 'arr[0].name'
function getNestedValue(accessVar: string, obj: any) {
  if (!accessVar) return undefined;
  const parts = accessVar.replace(/\]/g, "").split(/\.|\[/).filter(Boolean);
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    const idx = Number(p);
    cur = isNaN(idx) ? cur[p] : cur[idx];
  }
  return cur;
}

export default function GenericTable({
  data,
  dataCell,
  isHeaderVisible = true,
  isMasterTable = false,
  isLoading = false,
  itemsPerPageOptions = [5, 10, 15, 20],
  defaultItemsPerPage = 20,
  newItemLink,

  onEdit,
  onDelete,
  onView,
  skeletonRows = 5,
  className = "",
  rowKey,
  noDataMsg,
  isSelectable = false,
  selectedRowIndices = [],
  onSelectionChange,
}: GenericTableProps) {
  const nav = useNavigate();
  const { records } = toRecords(data);

  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | ((r: any) => any) | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  // Selection functionality - using Set for O(1) operations
  const selectedIndicesSet = useMemo(
    () => new Set(selectedRowIndices),
    [selectedRowIndices]
  );

  // Check if a specific row index is selected
  const isRowSelected = (globalIndex: number) => {
    if (!isSelectable) return false;
    return selectedIndicesSet.has(globalIndex);
  };

  // Toggle selection for a single row
  const toggleRowSelection = (globalIndex: number) => {
    if (!isSelectable || !onSelectionChange) return;

    const newSelectedIndices = [...selectedRowIndices];

    if (selectedIndicesSet.has(globalIndex)) {
      // Remove from selection
      const indexToRemove = newSelectedIndices.indexOf(globalIndex);
      if (indexToRemove > -1) {
        newSelectedIndices.splice(indexToRemove, 1);
      }
    } else {
      // Add to selection
      newSelectedIndices.push(globalIndex);
    }

    // Get the corresponding row objects
    const selectedRows = newSelectedIndices
      .map((index) => sorted[index])
      .filter(Boolean);
    onSelectionChange(newSelectedIndices, selectedRows);
  };

  // Get current page row indices in the context of sorted/filtered data
  const getCurrentPageGlobalIndices = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return Array.from({ length: paginated.length }, (_, i) => startIndex + i);
  };

  // Check if all rows on current page are selected
  const isAllCurrentPageSelected = () => {
    if (!isSelectable || paginated.length === 0) return false;
    const currentPageIndices = getCurrentPageGlobalIndices();
    return currentPageIndices.every((index) => selectedIndicesSet.has(index));
  };

  // Toggle selection for all rows on current page
  const toggleAllCurrentPageSelection = () => {
    if (!isSelectable || !onSelectionChange) return;

    const currentPageIndices = getCurrentPageGlobalIndices();
    let newSelectedIndices = [...selectedRowIndices];

    if (isAllCurrentPageSelected()) {
      // Deselect all from current page
      newSelectedIndices = newSelectedIndices.filter(
        (index) => !currentPageIndices.includes(index)
      );
    } else {
      // Select all from current page that aren't already selected
      const indicesToAdd = currentPageIndices.filter(
        (index) => !selectedIndicesSet.has(index)
      );
      newSelectedIndices.push(...indicesToAdd);
    }

    // Get the corresponding row objects
    const selectedRows = newSelectedIndices
      .map((index) => sorted[index])
      .filter(Boolean);
    onSelectionChange(newSelectedIndices, selectedRows);
  };

  // Clear all selections
  const clearSelection = () => {
    if (!isSelectable || !onSelectionChange) return;
    onSelectionChange([], []);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [JSON.stringify(records)]);

  // Calculate estimated action width based on buttons

  // NEW: central resolver that returns a safe primitive (string/number) or the raw value for render functions
  const resolveCellValue = (row: any, cell: DataCell): any => {
    let raw: any;
    try {
      if (typeof cell.accessVar === "function") raw = cell.accessVar(row);
      else if (cell.accessVar)
        raw = getNestedValue(String(cell.accessVar), row);
      else raw = undefined;
    } catch {
      raw = undefined;
    }

    // If user explicitly marked this column as isArray and it's an array, pick index 1
    if (cell.isArray && Array.isArray(raw)) {
      // prefer index 1, fallback to index 0 or empty string
      return raw[1] ?? raw[0] ?? "";
    }

    // Return raw value for render functions to handle
    return raw;
  };

  // Helper function to get searchable/sortable string value
  const getStringValue = (raw: any): string => {
    if (raw === null || raw === undefined) return "";

    // If value is array, handle gracefully: prefer index 1 if present
    if (Array.isArray(raw)) return String(raw[1] ?? raw[0] ?? "");

    // objects -> try to pick name-like props, else JSON stringify fallback
    if (raw !== null && typeof raw === "object") {
      if ("name" in raw) return String((raw as any).name);
      if ("label" in raw) return String((raw as any).label);
      // fallback to stringify (rare, but safe)
      try {
        return JSON.stringify(raw);
      } catch {
        return String(raw);
      }
    }

    // primitives
    return String(raw);
  };

  // SEARCH
  const searchableCells = dataCell.filter(
    (c) => (c.searchable ?? true) === true
  );
  const filtered = useMemo(() => {
    if (!searchValue) return records;
    const q = searchValue.toLowerCase().trim();
    return records.filter((row) => {
      for (const cell of searchableCells) {
        const v = resolveCellValue(row, cell);
        const searchStr = getStringValue(v);
        if (searchStr.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [records, searchValue, dataCell]);

  // SORT
  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let valA: any, valB: any;
      if (typeof sortConfig.key === "function") {
        valA = sortConfig.key(a);
        valB = sortConfig.key(b);
      } else {
        // find matching column by accessVar or headingTitle
        const col = dataCell.find(
          (c) =>
            (typeof c.accessVar === "string" &&
              c.accessVar === sortConfig.key) ||
            c.headingTitle === sortConfig.key
        );
        if (col) {
          valA = resolveCellValue(a, col);
          valB = resolveCellValue(b, col);
        } else {
          valA = getNestedValue(String(sortConfig.key), a);
          valB = getNestedValue(String(sortConfig.key), b);
        }
      }

      // Convert to sortable strings
      const strA = getStringValue(valA);
      const strB = getStringValue(valB);

      if (!strA && !strB) return 0;
      if (!strA) return 1;
      if (!strB) return -1;

      // Try numeric comparison first
      const numA = Number(strA);
      const numB = Number(strB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      // String comparison
      return sortConfig.direction === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
    return arr;
  }, [filtered, sortConfig, dataCell]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage, itemsPerPage]);

  // helpers
  const onSort = (cell: DataCell) => {
    if (cell.sortable === false) return;
    const key = cell.accessVar ?? cell.headingTitle;
    setSortConfig((prev) => {
      if (prev.key === key)
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      return { key, direction: "asc" };
    });
  };

  // Get base className for consistent width and alignment

  const hasActions = onEdit || onDelete || onView;

  const defaultRowKey = (r: any, i: number) =>
    rowKey ? rowKey(r, i) : r.id ?? r.code ?? i;

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl bg-white shadow-lg ring-1 ring-gray-100 overflow-hidden ${className}`}
    >
      {/* Header Section */}
      {isHeaderVisible && (
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchSm
              placeholder="Search..."
              onChange={(e: any) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              inputValue={searchValue}
              onSearch={() => {}}
              onClear={() => {
                setSearchValue("");
                setCurrentPage(1);
              }}
            />

            <DropdownSelect
              title=""
              direction="down"
              options={itemsPerPageOptions.map((item) => ({
                id: item,
                label: `${item} / page`,
              }))}
              selected={{
                id: itemsPerPage,
                label: `${itemsPerPage} / page`,
              }}
              onChange={(e: any) => {
                setItemsPerPage(e.id);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            {newItemLink && (
              <ButtonSm
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
                state="default"
                text="New"
                onClick={() => nav(newItemLink)}
              />
            )}

            {/* Selected Row Indicator */}
            {isSelectable && selectedRowIndices.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-blue-500 bg-blue-50 px-4 py-1.5">
                <span className="text-sm font-medium text-blue-600">
                  {selectedRowIndices.length} Selected
                </span>
                <button
                  onClick={clearSelection}
                  className="text-blue-600 text-sm font-bold hover:text-blue-700"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <div className="min-w-max divide-y divide-gray-200">
          {/* Table Header */}
          <div className="bg-gray-50 text-gray-800 text-sm font-semibold uppercase tracking-wide">
            <div className="flex items-center px-6 py-3">
              <div
                className={`${
                  isSelectable ? "w-[90px]" : "w-[60px]"
                } flex items-center gap-3`}
              >
                <span>S.No</span>
                {isSelectable && (
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected()}
                    onChange={toggleAllCurrentPageSelection}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
              </div>

              {dataCell.map((cell, idx) => (
                <div
                  key={idx}
                  onClick={() => onSort(cell)}
                  className={`flex-1 cursor-pointer select-none px-2 py-1 hover:text-blue-600 transition-colors`}
                >
                  <div className="flex items-center gap-1">
                    <span>{cell.headingTitle}</span>
                    {cell.sortable !== false && (
                      <img
                        src="/icons/dropdown.svg"
                        alt="sort"
                        className={`h-4 w-4 transition-transform ${
                          sortConfig.key ===
                            (cell.accessVar ?? cell.headingTitle) &&
                          sortConfig.direction === "desc"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </div>
                </div>
              ))}

              {hasActions && (
                <div className="min-w-[120px] text-right pr-3">Actions</div>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center px-6 py-3 border-b border-gray-100 animate-pulse"
                >
                  <div className={`${isSelectable ? "w-[90px]" : "w-[60px]"}`}>
                    <ShimmerBox className="h-4 w-10 rounded-md" />
                  </div>
                  {dataCell.map((_, j) => (
                    <div key={j} className="flex-1 px-2">
                      <ShimmerBox className="h-4 w-24 rounded-md" />
                    </div>
                  ))}
                  {hasActions && (
                    <div className="min-w-[120px] flex justify-end gap-2">
                      <ShimmerBox className="h-4 w-8 rounded-md" />
                      <ShimmerBox className="h-4 w-8 rounded-md" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Data */}
          {!isLoading && paginated.length === 0 && (
            <div className="py-10 text-center text-gray-500 font-medium">
              {noDataMsg || "No data available"}
            </div>
          )}

          {/* Table Rows */}
          {!isLoading &&
            paginated.map((row, idx) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + idx;
              return (
                <div
                  key={defaultRowKey(row, idx)}
                  className="flex items-center px-6 py-3 border-b border-gray-100 text-sm text-gray-700 hover:bg-blue-50/40 transition-colors"
                >
                  <div
                    className={`${
                      isSelectable ? "w-[90px]" : "w-[60px]"
                    } flex items-center gap-3`}
                  >
                    <span>{globalIndex + 1}</span>
                    {isSelectable && (
                      <input
                        type="checkbox"
                        checked={isRowSelected(globalIndex)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleRowSelection(globalIndex);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  {dataCell.map((cell, j) => {
                    const value = resolveCellValue(row, cell);
                    return (
                      <div key={j} className="flex-1 px-2 font-medium">
                        {cell.render ? (
                          cell.render(value, row, idx)
                        ) : (
                          <span>
                            {Array.isArray(value)
                              ? value[1] ?? value[0] ?? "-"
                              : value ?? "-"}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {hasActions && (
                    <div className="min-w-[120px] flex justify-end gap-2 pr-2">
                      {onView && !isMasterTable && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="p-2 rounded-md border border-gray-200 hover:bg-blue-100 hover:text-blue-600 transition-all"
                        >
                          <EyeIcon size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="p-2 rounded-md border border-gray-200 hover:bg-yellow-100 hover:text-yellow-600 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="p-2 rounded-md border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} –{" "}
            {Math.min(currentPage * itemsPerPage, sorted.length)} of{" "}
            {sorted.length}
          </span>
        </div>
        <PaginationControls
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </footer>
    </div>
  );
}
