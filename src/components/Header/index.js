import './index.css'
import {Link, withRouter} from 'react-router-dom'
import {GoHome} from 'react-icons/go'
import {BiShoppingBag} from 'react-icons/bi'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </Link>

        <ul className="mobile-unordered-container">
          <Link to="/" className="nav-link-item">
            <GoHome className="home-icon" />
          </Link>
          <Link to="/jobs" className="nav-link-item">
            <BiShoppingBag className="jobs-icon" />
          </Link>
        </ul>

        <ul className="unordered-container">
          <Link to="/" className="nav-link-item">
            <li className="list-item">Home</li>
          </Link>
          <Link to="/jobs" className="nav-link-item">
            <li className="list-item">Jobs</li>
          </Link>
        </ul>
        <button type="button" className="mobile-logout-btn">
          <FiLogOut className="exit-btn" onClick={onClickLogout} />
        </button>
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
