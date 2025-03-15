import React, { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate which page buttons to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate the range of pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust the range if at the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add the calculated range of pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis at the end
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newSize);
    }
  };
  
  // Update current page if page size changes and current page becomes invalid
  useEffect(() => {
    const newTotalPages = Math.ceil(totalItems / pageSize);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      onPageChange(newTotalPages);
    }
  }, [pageSize, totalItems, currentPage, onPageChange]);
  
  if (totalItems === 0) return null;
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between py-4">
      <div className="flex items-center mb-4 md:mb-0">
        <p className="text-sm text-gray-700 mr-4">
          Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
        <div className="flex items-center">
          <label htmlFor="pageSize" className="text-sm text-gray-700 mr-2">Show:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md text-sm py-1 pl-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      <div className="flex">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded-l-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {getPageNumbers().map((page, index) => (
          page < 0 ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-sm border-t border-b border-gray-300 bg-white text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm border border-gray-300 ${
                currentPage === page
                  ? 'bg-[#EE7F61] text-white border-[#EE7F61]'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              } ${index > 0 ? '-ml-px' : ''}`}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 text-sm rounded-r-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed -ml-px"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;