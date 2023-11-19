import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBagFill} from 'react-icons/bs'
import {RiPictureInPictureExitFill} from 'react-icons/ri'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: '',
    similarJobs: [],
    skillsList: [],
  }

  componentDidMount() {
    this.getSpecificDetails()
  }

  getSpecificDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log('data from item details =', response)

    if (response.ok === false) {
      console.log('response=', response)
      this.setState(
        {
          apiStatus: apiStatusConstants.failure,
        },
        this.returnResultContainer,
      )
    } else {
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs

      const updatedSimilarJobs = similarJobs.map(each => ({
        companyLogoUrl: each.company_logo_url,

        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      const {skills} = jobDetails

      const updatedSkills = skills.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))

      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        skills: updatedSkills,
      }

      this.setState(
        {
          jobDetails: updatedJobDetails,
          similarJobs: updatedSimilarJobs,
          skillsList: updatedSkills,

          apiStatus: apiStatusConstants.success,
        },
        this.returnResultContainer,
      )
    }
  }

  returnLifeAtCompany = obj => {
    console.log('obj=', obj)
    if (obj !== undefined) {
      return {
        description: obj.description,
        imageUrl: obj.image_url,
      }
    }
    return {
      description: '',
      imageUrl: '',
    }
  }

  returnSuccessView = () => {
    const {jobDetails, similarJobs, skillsList} = this.state
    console.log('skills from render=', skillsList)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      rating,
      location,
      packagePerAnnum,
      title,
    } = jobDetails
    console.log('life at company from render =', lifeAtCompany)
    const {description, imageUrl} = this.returnLifeAtCompany(lifeAtCompany)

    return (
      <>
        <div className="job-details-container">
          <div className="top-container">
            <div className="data-container">
              <div className="company-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="company-logo"
                />
                <div className="designation-container">
                  <h1 className="title">{title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star-img" />
                    <p>{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-salary-type-container">
                <div className="location-job-container">
                  <div className="location-container">
                    <IoLocationSharp />
                    <p className="location">{location}</p>
                  </div>
                  <div className="location-container">
                    <BsBagFill />
                    <p className="location">{employmentType}</p>
                  </div>
                </div>
                <p className="salary">{packagePerAnnum}</p>
              </div>

              <hr className="horizontal-line" />

              <div className="heading-and-button-container">
                <h1 className="salary">Description</h1>
                <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                  <button type="button" className="visit-btn">
                    <p>Visit</p>
                    <RiPictureInPictureExitFill />
                  </button>
                </a>
              </div>
              <p className="salary">{jobDescription}</p>
              <h1 className="skills-heading">Skills</h1>
              <ul className="skills-container">
                {skillsList.map(each => (
                  <li className="skill-item" key={each.name}>
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-img"
                    />
                    <p className="skill-name">{each.name}</p>
                  </li>
                ))}
              </ul>
              <h1 className="skills-heading">Life at Company</h1>
              <div className="life-at-company-container">
                <p className="skills-heading">{description}</p>
                <img src={imageUrl} alt="life at company" />
              </div>
            </div>
            <div className="bottom-container">
              <h1 className="skills-heading">Similar Jobs</h1>
              <ul className="similar-jobs-container">
                {similarJobs.map(each => (
                  <li className="similar-job-item" key={each.name}>
                    <div className="company-container">
                      <img
                        src={each.companyLogoUrl}
                        alt="similar job company logo"
                        className="company-logo"
                      />
                      <div className="designation-container">
                        <h1 className="title">{each.title}</h1>
                        <div className="rating-container">
                          <AiFillStar className="star-img" />
                          <p>{each.rating}</p>
                        </div>
                      </div>
                    </div>
                    <h1>Description</h1>
                    <p>{each.jobDescription}</p>
                    <div className="location-salary-type-container">
                      <div className="location-job-container">
                        <div className="location-container">
                          <IoLocationSharp />
                          <p className="location">{each.location}</p>
                        </div>
                        <div className="location-container">
                          <BsBagFill />
                          <p className="location">{each.employmentType}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" height="50" width="50" color="#ffffff" />
    </div>
  )

  onClickJobsFailureBtn = () => {
    this.setState(
      {
        apiStatus: apiStatusConstants.inProgress,
      },
      this.getSpecificDetails,
    )
  }

  renderFailureView = () => (
    <div className="jobs-list-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="jobs-failure-retry-btn"
        onClick={this.onClickJobsFailureBtn}
      >
        Retry
      </button>
    </div>
  )

  returnResultContainer = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.returnSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.returnResultContainer()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
