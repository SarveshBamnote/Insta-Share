import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {
    profileDetail: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        posts: data.user_details.posts.map(eachPost => ({
          id: eachPost.id,
          image: eachPost.image,
        })),
        postsCount: data.user_details.posts_count,
        profilePic: data.user_details.profile_pic,
        stories: data.user_details.stories.map(eachStory => ({
          id: eachStory.id,
          image: eachStory.image,
        })),
        userBio: data.user_details.user_bio,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
      }
      this.setState({
        profileDetail: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileFailureView = () => (
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
        onClick={() => this.getProfile()}
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

  renderUserProfileView = () => {
    const {profileDetail} = this.state
    const {
      profilePic,
      userName,
      postsCount,
      followersCount,
      followingCount,
      userBio,
      stories,
      posts,
      userId,
    } = profileDetail
    return (
      <div className="profile-container">
        <div className="profile-detail-large">
          <img
            className="profile-picture"
            src={profilePic}
            alt="user profile"
          />
          <div>
            <h1 className="profile-user-name">{userName}</h1>
            <div className="profile-counts-detail">
              <p className="profile-count">
                <span className="highlight">{postsCount}</span>
                posts
              </p>
              <p className="profile-count">
                <span className="highlight">{followersCount}</span>
                followers
              </p>
              <p className="profile-count">
                <span className="highlight">{followingCount}</span>
                following
              </p>
            </div>
            <p className="profile-user-id">{userId}</p>
            <p className="profile-user-bio">{userBio}</p>
          </div>
        </div>

        <div className="profile-detail-mobile">
          <h1 className="profile-user-name">{userName}</h1>
          <div className="profile-counts-detail">
            <img
              className="profile-picture"
              src={profilePic}
              alt="user profile"
            />
            <p className="profile-count">
              <span className="highlight">{postsCount}</span>
              <br /> posts
            </p>
            <p className="profile-count">
              <span className="highlight">{followersCount}</span>
              <br /> followers
            </p>
            <p className="profile-count">
              <span className="highlight">{followingCount}</span>
              <br /> following
            </p>
          </div>
          <p className="profile-user-id">{userId}</p>
          <p className="profile-user-bio">{userBio}</p>
        </div>

        <ul className="profile-stories">
          {stories.map(each => (
            <li className="profile-stories-item" key={each.id}>
              <img
                className="profile-stories-image"
                src={each.image}
                alt="user story"
              />
            </li>
          ))}
        </ul>
        <hr className="profile-hr-line" />
        <div className="profile-posts-head">
          <BsGrid3X3 className="profile-grid-icon" />
          <h1 className="profile-posts-heading">Posts</h1>
        </div>

        {posts.length > 0 ? (
          <ul className="profile-posts-list">
            {posts.map(each => (
              <li className="profile-posts-list-item" key={each.id}>
                <img
                  className="profile-posts-list-image"
                  src={each.image}
                  alt="user post"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="profile-no-post-container">
            <BiCamera className="profile-bi-camera-icon" />
            <h1 className="profile-no-post-heading">No Posts Yet</h1>
          </div>
        )}
      </div>
    )
  }

  renderUserProfilePage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderUserProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderUserProfilePage()}
      </>
    )
  }
}

export default UserProfile
