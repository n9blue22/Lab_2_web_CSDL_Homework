function SearchBar({ value, onChange, isSearching }) {
  return (
    <div className="search-wrap">
      <label htmlFor="post-search">Search posts</label>
      <input
        id="post-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search posts..."
        type="search"
      />
      {isSearching && <span className="search-status">Searching...</span>}
    </div>
  )
}

export default SearchBar
