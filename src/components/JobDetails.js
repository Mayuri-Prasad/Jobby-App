import React, { useEffect, useState, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './Header';
import LoaderComponent from './LoaderComponent';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const JobDetails = props => {
  const [jobData, setJobData] = useState({});
  const [similarJobs, setSimilarJobs] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const getJobData = useCallback(async () => {
    const { match } = props;
    const { params } = match;
    const { id } = params;

    setApiStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`;
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
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          skills: data.job_details.skills.map(skill => ({
            imageUrl: skill.image_url,
            name: skill.name,
          })),
          title: data.job_details.title,
        };

        const updatedSimilarJobs = data.similar_jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          id: job.id,
          jobDescription: job.job_description,
          location: job.location,
          rating: job.rating,
          title: job.title,
        }));

        setJobData(updatedData);
        setSimilarJobs(updatedSimilarJobs);
        setApiStatus(apiStatusConstants.success);
      } else {
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure);
    }
  }, [props]);

  useEffect(() => {
    getJobData();
  }, [getJobData]);

  const renderJobDetailsSuccessView = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobData;

    return (
      <div className="job-details-success-container">
        <div className="job-details-container">
          <div className="company-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1>{title}</h1>
              <p>Rating: {rating}</p>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-employment-container">
              <p>Location: {location}</p>
              <p>Employment Type: {employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description-container">
            <div className="description-visit-container">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                Visit
              </a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <h1>Skills</h1>
          <ul className="skills-list">
            {skills.map(skill => (
              <li className="skill-item" key={skill.name}>
                <img src={skill.imageUrl} alt={skill.name} className="skill-image" />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>
          <div className="life-at-company-container">
            <div className="life-at-company-description">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(job => (
            <li className="similar-job-item" key={job.id}>
              <div className="company-container">
                <img
                  src={job.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <h1>{job.title}</h1>
                  <p>Rating: {job.rating}</p>
                </div>
              </div>
              <h1>Description</h1>
              <p>{job.jobDescription}</p>
              <div className="location-employment-container">
                <p>Location: {job.location}</p>
                <p>Employment Type: {job.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderFailureView = () => (
    <div className="job-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-button"
        onClick={getJobData}
      >
        Retry
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <LoaderComponent />
    </div>
  );

  const renderJobDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobDetailsSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken === undefined) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="job-details-container">
        {renderJobDetails()}
      </div>
    </>
  );
};

export default JobDetails;
