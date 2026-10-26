function Pagination({ page, totalPages, onPrevious, onNext, disabled }) {
  return (
    <nav className="pagination" aria-label="Post pages">
      <button type="button" onClick={onPrevious} disabled={disabled || page === 1}>
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" onClick={onNext} disabled={disabled || page === totalPages}>
        Next
      </button>
    </nav>
  )
}

export default Pagination
