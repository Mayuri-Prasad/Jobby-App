import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = props => {
  const onClickLogout = () => {
    const { history } = props;
    Cookies.remove('jwt_token');
    history.replace('/login');
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <Link to="/">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default withRouter(Header);
