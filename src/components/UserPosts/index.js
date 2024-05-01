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

class UserPosts extends Component {
  state = {
    posts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'
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
        posts: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderPostsList = () => {
    const {posts} = this.state
    return (
      <ul className="user-post-component">
        {posts.map(eachPost => (
          <PostItem postData={eachPost} key={eachPost.postId} />
        ))}
      </ul>
    )
  }

  renderPostsFailureView = () => (
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
        onClick={() => this.getPosts()}
      >
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderHomePosts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPostsList()
      case apiStatusConstants.failure:
        return this.renderPostsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return this.renderHomePosts()
  }
}

export default UserPosts
