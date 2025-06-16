import React from "react";

function PaginationDot({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`w-3 hover:cursor-pointer h-3 rounded-full ${
            index + 1 === currentPage ? "bg-blue-600" : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

export default PaginationDot;
