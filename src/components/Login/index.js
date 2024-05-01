import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    showPassword: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitLoginform = async event => {
    event.preventDefault()
    let {username, password} = this.state

    if (username === 'sarvesh') username = 'rahul'
    if (password === 'sarvesh@2024') password = 'rahul@2021'

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onShowPassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  usernameInputContainer = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="username">
          Username
        </label>
        <input
          className="input-field"
          onChange={this.onChangeUsername}
          id="username"
          type="text"
          value={username}
          placeholder="Username : sarvesh"
        />
      </div>
    )
  }

  passwordInputContainer = () => {
    const {password, showPassword} = this.state

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="password">
          Password
        </label>
        <input
          className="input-field"
          onChange={this.onChangePassword}
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder="Password : sarvesh@2024"
        />

        <div className="checkbox-container">
          <input
            className="checkbox"
            type="checkbox"
            id="checkbox"
            onChange={this.onShowPassword}
          />
          <label className="input-label" htmlFor="checkbox">
            Show Password
          </label>
        </div>
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dvfis8gsw/image/upload/v1707567998/login_page_image_k0gaqw.png"
          alt="website login"
          className="login-page-image"
        />
        <form
          className="login-form-container"
          onSubmit={this.onSubmitLoginform}
        >
          <img
            src="https://res.cloudinary.com/dvfis8gsw/image/upload/v1707590039/logo_alnltp.png"
            alt="website logo"
            className="login-website-logo"
          />
          <h1 className="website-logo-heading">Insta Share</h1>

          {this.usernameInputContainer()}
          {this.passwordInputContainer()}

          {showSubmitError && <p className="error-msg">*{errorMsg}</p>}

          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
