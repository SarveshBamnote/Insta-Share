import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiOutlineHeart} from 'react-icons/ai'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import './index.css'

class PostCard extends Component {
  state = {
    likeStatus: false,
  }

  changeLikeStatus = async status => {
    const {postData} = this.props
    const {postId} = postData
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        like_status: status,
      }),
      method: 'POST',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.setState(prevState => ({likeStatus: !prevState.likeStatus}))
    }
  }

  onClickChangeStatus = () => {
    const {likeStatus} = this.state
    this.changeLikeStatus(!likeStatus)
  }

  render() {
    const {postData} = this.props
    const {profilePic, userName, postDetails, likesCount, comments} = postData
    const {imageUrl, caption} = postDetails
    const {likeStatus} = this.state

    return (
      <li className="post-list-item">
        <div className="profile-and-name">
          <img
            className="post-profile-pic"
            src={profilePic}
            alt="post author profile"
          />
          <Link
            to={`/users/${postData.userId}`}
            className="post-user-name-link"
          >
            <h1 className="post-user-name">{userName}</h1>
          </Link>
        </div>
        <img className="uploaded-post" src={imageUrl} alt="post" />
        <div className="post-image-footer">
          <div className="post-reactions">
            {likeStatus ? (
              <button
                className="like-button"
                type="button"
                testid="unLikeIcon"
                aria-label="button"
                onClick={this.onClickChangeStatus}
              >
                <FcLike className="reaction-icon-like" />
              </button>
            ) : (
              <button
                className="unlike-button"
                type="button"
                testid="likeIcon"
                aria-label="button"
                onClick={this.onClickChangeStatus}
              >
                <AiOutlineHeart className="reaction-icon-unlike" />
              </button>
            )}

            <FaRegComment className="reaction-icon" />
            <BiShareAlt className="reaction-icon" />
          </div>
          {likeStatus ? (
            <p className="post-likes">{likesCount + 1} likes</p>
          ) : (
            <p className="post-likes">{likesCount} likes</p>
          )}
          <p className="post-caption">{caption}</p>
          <ul className="post-comments">
            {comments.map(eachComment => (
              <li className="each-comment-list" key={eachComment.userId}>
                <p className="each-comment">
                  <span className="each-comment-userName">
                    {eachComment.userName}
                  </span>{' '}
                  {eachComment.comment}
                </p>
              </li>
            ))}
          </ul>
          <p className="post-created-at">{postData.createdAt}</p>
        </div>
      </li>
    )
  }
}

export default PostCard
