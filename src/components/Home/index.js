import Header from '../Header'
import UserStories from '../UserStories'
import SearchResult from '../SearchResult'
import UserPosts from '../UserPosts'

import SearchContext from '../../context/SearchContext'

import './index.css'

const Home = () => {
  const renderHomePage = () => (
    <div className="home-component">
      <UserStories />
      <UserPosts />
    </div>
  )

  return (
    <SearchContext.Consumer>
      {value => {
        const {isSearchButtonClicked, searchInput} = value

        return (
          <>
            <Header />
            {isSearchButtonClicked === true && (
              <SearchResult searchInput={searchInput} />
            )}
            {isSearchButtonClicked === false && renderHomePage()}
          </>
        )
      }}
    </SearchContext.Consumer>
  )
}

export default Home
