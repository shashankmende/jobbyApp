import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBagFill} from 'react-icons/bs'
import {RiPictureInPictureExitFill} from 'react-icons/ri'
import Header from '../Header'
import SkillItems from '../SkillItems'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRSS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: '',
    similarJobs: [],
    skillsList: [],
    lifeAtCompany: '',
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
    console.log('data from item details =', data)
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

    if (response.ok === true) {
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        skillsList: updatedSkills,

        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
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

  render() {
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
              <h1 className="skills-heading">Skills</h1>
              <SkillItems skills={skillsList} />
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
                  <li className="similar-job-item">
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default JobItemDetails
