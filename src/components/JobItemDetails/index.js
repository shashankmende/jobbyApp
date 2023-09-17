import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBagFill} from 'react-icons/bs'
import {RiPictureInPictureExitFill} from 'react-icons/ri'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRSS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
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
    console.log('data from specific ', data)
    const updatedObj = {
      updatedSkills,
      updatedSimilarJobs,
    }
    if (response.ok === true) {
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  render() {
    const {jobDetails, similarJobs} = this.state
    console.log(jobDetails, similarJobs)
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
      skills,
    } = jobDetails
    return (
      <>
        <Header />
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
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default JobItemDetails
