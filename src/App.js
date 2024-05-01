import {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import MyProfile from './components/MyProfile'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

import SearchContext from './context/SearchContext'

import './App.css'

class App extends Component {
  state = {
    searchInput: '',
    searchPosts: [],
    isSearchButtonClicked: false,
  }

  updateSearchInput = value => {
    this.setState({searchInput: value})
  }

  searchButtonClicked = () => {
    const {searchInput} = this.state
    if (searchInput !== '') {
      this.setState({isSearchButtonClicked: true})
    }
  }

  resetSearchButton = () => {
    this.setState({isSearchButtonClicked: false})
  }

  render() {
    const {searchInput, searchPosts, isSearchButtonClicked} = this.state

    return (
      <SearchContext.Provider
        value={{
          searchInput,
          searchPosts,
          updateSearchInput: this.updateSearchInput,
          isSearchButtonClicked,
          searchButtonClicked: this.searchButtonClicked,
          resetSearchButton: this.resetSearchButton,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
