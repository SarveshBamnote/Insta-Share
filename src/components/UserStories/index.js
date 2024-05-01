import {Component} from 'react'
import Slider from 'react-slick'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserStories extends Component {
  state = {
    stories: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.users_stories.map(eachStory => ({
        storyUrl: eachStory.story_url,
        userId: eachStory.user_id,
        userName: eachStory.user_name,
      }))
      console.log(updatedData)
      this.setState({
        stories: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderUserStoriesView = () => {
    const {stories} = this.state
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
      ],
    }
    return (
      <ul className="slider-component">
        <Slider {...settings}>
          {stories.map(eachStory => {
            const {storyUrl, userId, userName} = eachStory
            return (
              <li className="slick-list-item" key={userId}>
                <div className="slick-item">
                  <img
                    className="story-image"
                    src={storyUrl}
                    alt="user story"
                  />
                  <p className="story-user-name marquee">
                    <span>{userName}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </Slider>
      </ul>
    )
  }

  renderUserStoriesFailureView = () => (
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
        onClick={() => this.getStories()}
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

  renderUserStories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderUserStoriesView()
      case apiStatusConstants.failure:
        return this.renderUserStoriesFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderUserStories()}</>
  }
}

export default UserStories
