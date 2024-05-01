import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import PostItem from '../PostItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchResult extends Component {
  state = {
    searchPosts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    const {searchInput} = this.props
    this.getSearchPosts(searchInput)
  }

  getSearchPosts = async searchInput => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.posts.map(post => ({
        comments: post.comments.map(each => ({
          comment: each.comment,
          userId: each.user_id,
          userName: each.user_name,
        })),
        createdAt: post.created_at,
        likesCount: post.likes_count,
        postDetails: {
          caption: post.post_details.caption,
          imageUrl: post.post_details.image_url,
        },
        postId: post.post_id,
        profilePic: post.profile_pic,
        userId: post.user_id,
        userName: post.user_name,
      }))

      this.setState({
        searchPosts: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  noSearchResult = () => (
    <div className="no-search-result">
      <img
        src="https://res.cloudinary.com/dvfis8gsw/image/upload/v1708544405/search_not_found_axais6.png"
        alt="search not found"
        className="no-search-result-image"
      />
      <h1 className="no-search-result-heading">Search Not Found</h1>
      <p className="no-search-result-para">
        Try different keyword or search again
      </p>
    </div>
  )

  renderSearchPostsList = () => {
    const {searchPosts} = this.state
    return (
      <div className="search-component">
        <h1 className="search-results-heading">Search Results</h1>
        <ul className="search-results-post">
          {searchPosts.map(eachPost => (
            <PostItem postData={eachPost} key={eachPost.postId} />
          ))}
        </ul>
      </div>
    )
  }

  renderConditionForSearchResults = () => {
    const {searchPosts} = this.state

    if (searchPosts.length > 0) {
      return this.renderSearchPostsList()
    }
    return this.noSearchResult()
  }

  renderSearchFailureView = () => {
    const {searchInput} = this.props
    return (
      <div className="failure-view">
        <img
          src="https://res.cloudinary.com/dvfis8gsw/image/upload/v1707767077/error_Icon_duftal.png"
          alt="failure view"
          className="failure-view-image"
        />
        <p className="failure-view-para">
          Something went wrong. Please try again
        </p>
        <button
          className="try-again-button"
          type="button"
          onClick={() => this.getSearchPosts(searchInput)}
        >
          Try again
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSearchPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderConditionForSearchResults()
      case apiStatusConstants.failure:
        return this.renderSearchFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderSearchPage()}</div>
  }
}

export default SearchResult
