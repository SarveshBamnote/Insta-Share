import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dvfis8gsw/image/upload/v1708023788/page_not_found_ji7dlb.png"
      alt="page not found"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-para">
      we are sorry, the page you requested could not be found.
      <br />
      Please go back to the homepage.
    </p>
    <Link to="/">
      <button className="not-found-home-button" type="button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
