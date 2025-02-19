import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './Header';
import LoaderComponent from './LoaderComponent';

const employmentTypesList = [
  { label: 'Full Time', employmentTypeId: 'FULLTIME' },
  { label: 'Part Time', employmentTypeId: 'PARTTIME' },
  { label: 'Freelance', employmentTypeId: 'FREELANCE' },
  { label: 'Internship', employmentTypeId: 'INTERNSHIP' },
];

const salaryRangesList = [
  { salaryRangeId: '1000000', label: '10 LPA and above' },
  { salaryRangeId: '2000000', label: '20 LPA and above' },
  { salaryRangeId: '3000000', label: '30 LPA and above' },
  { salaryRangeId: '4000000', label: '40 LPA and above' },
];

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const Jobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [profileData, setProfileData] = useState({});
  const [profileApiStatus, setProfileApiStatus] = useState(
    apiStatusConstants.initial,
  );
  const [searchInput, setSearchInput] = useState('');
  const [employmentType, setEmploymentType] = useState([]);
  const [minimumPackage, setMinimumPackage] = useState('');

  const getJobs = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumPackage}&search=${searchInput}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };

    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      if (response.ok) {
        const updatedData = data.jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          title: job.title,
        }));
        setJobsList(updatedData);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
    }
  }, [employmentType, minimumPackage, searchInput]);

  const getProfile = async () => {
    setProfileApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const apiUrl = 'https://apis.ccbp.in/profile';
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    };

    try {
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      if (response.ok) {
        const updatedData = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        };
        setProfileData(updatedData);
        setProfileApiStatus(apiStatusConstants.success);
      } else {
        setProfileApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setProfileApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getProfile();
    getJobs();
  }, [getJobs]);

  const onChangeSearchInput = event => {
    setSearchInput(event.target.value);
  };

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      getJobs();
    }
  };

  const onClickSearchButton = () => {
    getJobs();
  };

  const renderSearchInput = () => (
    <div className="search-input-container">
      <input
        type="search"
        className="search-input"
        placeholder="Search"
        value={searchInput}
        onChange={onChangeSearchInput}
        onKeyDown={onEnterSearchInput}
      />
      <button
        type="button"
        data-testid="searchButton"
        className="search-button"
        onClick={onClickSearchButton}
      >
        Search
      </button>
    </div>
  );

  const renderProfileSuccessView = () => (
    <div className="profile-container">
      <img
        src={profileData.profileImageUrl}
        alt="profile"
        className="profile-img"
      />
      <h1 className="profile-name">{profileData.name}</h1>
      <p className="profile-description">{profileData.shortBio}</p>
    </div>
  );

  const renderProfileFailureView = () => (
    <div className="profile-error-view-container">
      <button
        type="button"
        className="profile-failure-button"
        onClick={getProfile}
      >
        Retry
      </button>
    </div>
  );

  const renderProfileLoadingView = () => (
    <div className="profile-loader-container" data-testid="loader">
      <LoaderComponent />
    </div>
  );

  const renderProfile = () => {
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return renderProfileSuccessView();
      case apiStatusConstants.failure:
        return renderProfileFailureView();
      case apiStatusConstants.inProgress:
        return renderProfileLoadingView();
      default:
        return null;
    }
  };

  const renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-img"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  );

  const renderJobsSuccessView = () => {
    if (jobsList.length === 0) {
      return renderNoJobsView();
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li className="job-item" key={job.id}>
            <Link to={`/jobs/${job.id}`} className="link-item">
              <div className="company-container">
                <img
                  src={job.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <h1>{job.title}</h1>
                  <p>Rating: {job.rating}</p>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-employment-container">
                  <p>Location: {job.location}</p>
                  <p>Employment Type: {job.employmentType}</p>
                </div>
                <p>{job.packagePerAnnum}</p>
              </div>
              <hr className="line" />
              <h1>Description</h1>
              <p>{job.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderJobsFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="jobs-failure-button" onClick={getJobs}>
        Retry
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <LoaderComponent />
    </div>
  );

  const renderJobs = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobsSuccessView();
      case apiStatusConstants.failure:
        return renderJobsFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  const onSelectEmploymentType = event => {
    const { checked, value } = event.target;
    if (checked) {
      setEmploymentType(prev => [...prev, value]);
    } else {
      setEmploymentType(prev => prev.filter(each => each !== value));
    }
  };

  const onSelectSalaryRange = event => {
    setMinimumPackage(event.target.value);
  };

  return (
    <>
      <Header />
      <div className="jobs-container">
        <div className="jobs-content">
          <div className="search-filters-container">
            {renderSearchInput()}
            {renderProfile()}
            <hr className="line" />
            <h1 className="filter-heading">Type of Employment</h1>
            <ul className="employment-types-list">
              {employmentTypesList.map(type => (
                <li className="employment-item" key={type.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={type.employmentTypeId}
                    className="checkbox"
                    value={type.employmentTypeId}
                    onChange={onSelectEmploymentType}
                  />
                  <label className="label" htmlFor={type.employmentTypeId}>
                    {type.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="line" />
            <h1 className="filter-heading">Salary Range</h1>
            <ul className="salary-ranges-list">
              {salaryRangesList.map(range => (
                <li className="salary-item" key={range.salaryRangeId}>
                  <input
                    type="radio"
                    id={range.salaryRangeId}
                    className="radio"
                    name="salary"
                    value={range.salaryRangeId}
                    onChange={onSelectSalaryRange}
                  />
                  <label className="label" htmlFor={range.salaryRangeId}>
                    {range.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-list-container">{renderJobs()}</div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
