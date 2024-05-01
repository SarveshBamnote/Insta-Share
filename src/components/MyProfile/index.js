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

class MyProfile extends Component {
  state = {
    profileDetail: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = {
        followersCount: data.profile.followers_count,
        followingCount: data.profile.following_count,
        id: data.profile.id,
        posts: data.profile.posts.map(eachPost => ({
          id: eachPost.id,
          image: eachPost.image,
        })),
        postsCount: data.profile.posts_count,
        profilePic: data.profile.profile_pic,
        stories: data.profile.stories.map(eachStory => ({
          id: eachStory.id,
          image: eachStory.image,
        })),
        userBio: data.profile.user_bio,
        userId: data.profile.user_id,
        userName: data.profile.user_name,
      }
      this.setState({
        profileDetail: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getProfile()
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
        onClick={this.onClickRetry}
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

  renderMyProfileView = () => {
    const {profileDetail} = this.state
    const {
      profilePic,
      //  userName,
      postsCount,
      followersCount,
      followingCount,
      userBio,
      stories,
      posts,
      //  userId,
    } = profileDetail
    return (
      <div className="profile-container">
        <div className="profile-detail-large">
          <img className="profile-picture" src={profilePic} alt="my profile" />
          <div>
            <h1 className="profile-user-name">Sarvesh</h1>
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
            <p className="profile-user-id">sarvesh</p>
            <p className="profile-user-bio">{userBio}</p>
          </div>
        </div>

        <div className="profile-detail-mobile">
          <h1 className="profile-user-name">Sarvesh</h1>
          <div className="profile-counts-detail">
            <img
              className="profile-picture"
              src={profilePic}
              alt="my profile"
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
          <p className="profile-user-id">sarvesh</p>
          <p className="profile-user-bio">{userBio}</p>
        </div>

        <ul className="profile-stories">
          {stories.map(each => (
            <li className="profile-stories-item" key={each.id}>
              <img
                className="profile-stories-image"
                src={each.image}
                alt="my story"
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
                  alt="my post"
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

  renderMyProfilePage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMyProfileView()
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
        {this.renderMyProfilePage()}
      </>
    )
  }
}

export default MyProfile
