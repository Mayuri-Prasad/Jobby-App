import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const NotFound = () => (
  <>
    <Header />
    <div className="not-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
        className="not-found-img"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-description">
        We're sorry, the page you requested could not be found.
      </p>
      <Link to="/">
        <button type="button" className="home-button">
          Go Back to Home
        </button>
      </Link>
    </div>
  </>
);

export default NotFound;
