import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './Header';

const Home = () => {
  const jwtToken = Cookies.get('jwt_token');
  
  if (jwtToken === undefined) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-heading">
            Find The Job That Fits Your Life
          </h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information, company reviews. Find the job that fits your abilities and potential.
          </p>
          <Link to="/jobs">
            <button className="find-jobs-button" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
