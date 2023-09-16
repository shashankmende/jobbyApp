import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', ErrorMsg: ''}

  onChangeUserInput = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props

    history.replace('/')
    this.setState({
      ErrorMsg: '',
    })
  }

  onSubmitFailure = error => {
    console.log('error=', error)
    this.setState({
      ErrorMsg: `*${error}`,
    })
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log('data =', response)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {ErrorMsg} = this.state
    return (
      <div className="bg-container">
        <form className="form-container" onClick={this.onClickLogin}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="webiste-logo"
          />
          <div className="username-container">
            <label htmlFor="username" className="username-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="userinput"
              onChange={this.onChangeUserInput}
            />
          </div>
          <div className="username-container">
            <label htmlFor="password" className="username-label">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="userinput"
              onChange={this.onChangePassword}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="error-msg">{ErrorMsg}</p>
        </form>
      </div>
    )
  }
}

export default Login
