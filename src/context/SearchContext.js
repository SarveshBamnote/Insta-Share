import React from 'react'

const SearchContext = React.createContext({
  searchInput: '',
  searchPosts: [],
  updateSearchInput: () => {},
  isSearchButtonClicked: false,
  searchButtonClicked: () => {},
  resetSearchButton: () => {},
})

export default SearchContext
