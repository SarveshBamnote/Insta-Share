import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {IoMenu} from 'react-icons/io5'
import {FaSearch} from 'react-icons/fa'
import {RiCloseCircleFill} from 'react-icons/ri'

import SearchContext from '../../context/SearchContext'

import './index.css'

class Header extends Component {
  state = {showMenu: false, searchBar: false}

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickHambergerMenu = () => {
    this.setState(prevState => ({showMenu: !prevState.showMenu}))
  }

  onClickShowSearch = () => {
    this.setState(prevState => ({searchBar: !prevState.searchBar}))
  }

  render() {
    return (
      <SearchContext.Consumer>
        {value => {
          const {
            updateSearchInput,
            searchButtonClicked,
            searchInput,
            resetSearchButton,
          } = value

          const onChangeSearchInput = event => {
            updateSearchInput(event.target.value)
            resetSearchButton()
          }

          const onClickSearch = () => {
            searchButtonClicked()
          }

          const {showMenu, searchBar} = this.state

          const isSearchSelected = searchBar
            ? 'nav-mobile-search-btn search-selected'
            : 'nav-mobile-search-btn'

          return (
            <>
              <nav className="nav-header">
                <div className="nav-content">
                  <div className="logo-and-heading">
                    <Link to="/">
                      <img
                        src="https://res.cloudinary.com/dvfis8gsw/image/upload/v1707590039/logo_alnltp.png"
                        alt="website logo"
                        className="website-logo"
                      />
                    </Link>
                    <h1 className="website-logo-heading">Insta Share</h1>
                  </div>

                  <div className="nav-options">
                    <div className="search-container">
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Search Caption"
                        onChange={onChangeSearchInput}
                        value={searchInput}
                      />
                      <button
                        type="button"
                        className="search-icon-btn"
                        testid="searchIcon"
                        aria-label="button"
                        onClick={onClickSearch}
                      >
                        <FaSearch className="search-icon" />
                      </button>
                    </div>
                    <ul className="nav-menu">
                      <Link to="/" className="option">
                        <li>Home</li>
                      </Link>

                      <Link to="/my-profile" className="option">
                        <li>Profile</li>
                      </Link>
                    </ul>
                    <button
                      className="header-logout-btn"
                      onClick={this.onClickLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                  <button
                    className="hamburger-menu-button"
                    onClick={this.onClickHambergerMenu}
                    type="button"
                    aria-label="menu-button"
                  >
                    <IoMenu className="hamburger-menu-icon" />
                  </button>
                </div>
              </nav>
              {showMenu && (
                <div className="nav-mobile">
                  <ul className="nav-mobile-menu">
                    <li>
                      <Link to="/" className="nav-mobile-option">
                        Home
                      </Link>
                    </li>

                    <li>
                      <button
                        className={isSearchSelected}
                        onClick={this.onClickShowSearch}
                        type="button"
                      >
                        Search
                      </button>
                    </li>

                    <li>
                      <Link to="/my-profile" className="nav-mobile-option">
                        Profile
                      </Link>
                    </li>

                    <li>
                      <button
                        className="header-logout-btn-sm"
                        onClick={this.onClickLogout}
                        type="button"
                      >
                        Logout
                      </button>
                    </li>

                    <li>
                      <button
                        className="header-close-button"
                        type="button"
                        onClick={this.onClickHambergerMenu}
                        aria-label="close-button"
                      >
                        <RiCloseCircleFill className="header-close-icon" />
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {searchBar && showMenu === true && (
                <div className="search-container-small">
                  <input
                    className="search-input"
                    type="search"
                    placeholder="Search Caption"
                    onChange={onChangeSearchInput}
                    value={searchInput}
                  />
                  <button
                    type="button"
                    className="search-icon-btn"
                    data-testid="searchIcon"
                    aria-label="button"
                    onClick={onClickSearch}
                  >
                    <FaSearch className="search-icon" />
                  </button>
                </div>
              )}
              <hr className="navbar-footer-line" />
            </>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default withRouter(Header)
