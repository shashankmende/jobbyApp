import './index.css'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'
import {Component} from 'react'
import JobItems from '../JobItems'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRSS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: '',
    apiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    EType: [],
    minPackage: '',
    jobSearch: '',
    jobsList: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  onJobsApiSuccess = list => {
    console.log('list', list)

    this.setState({
      jobsList: list,
      jobsApiStatus: apiStatusConstants.success,
    })
  }

  onJobsApiFailure = error => {
    console.log('error', error)
    this.setState({
      jobsApiStatus: apiStatusConstants.failure,
    })
  }

  getJobs = async () => {
    this.setState({
      jobsApiStatus: apiStatusConstants.inProgress,
    })
    const {jobSearch, minPackage, EType} = this.state
    const joinType = EType.join(',')
    console.log(joinType)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${joinType}&minimum_package=${minPackage}&search=${jobSearch}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onJobsApiSuccess(data.jobs)
    } else {
      this.onJobsApiFailure(data.error_msg)
    }
    console.log('data from jobs', data)
  }

  onChangeJobSearch = event => {
    console.log('event', event.target.value)

    this.setState({
      jobSearch: event.target.value,
    })
  }

  onChangeCheckBox = event => {
    const {EType} = this.state
    console.log(event.target.value)
    const empValue = event.target.value
    const isExist = EType.includes(empValue)
    if (isExist === false) {
      EType.push(empValue)
    } else {
      const index = EType.indexOf(empValue)
      console.log('index=', index)
      EType.splice(index, 1)
    }

    this.setState(
      {
        EType,
      },
      this.getJobs,
    )
  }

  onClickRadioInput = event => {
    console.log(event.target.value)
    this.setState(
      {
        minPackage: event.target.value,
      },
      this.getJobs,
    )
  }

  onClickSearchBtn = () => {
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const profileUrl = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    console.log('profile details =', data)
    if (response.ok === true) {
      const userDet = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: userDet,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderApiProfileSuccess = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails

    return (
      <div className="mob-profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="name">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryBtn = () => {
    this.setState(
      {
        apiStatus: apiStatusConstants.inProgress,
      },
      this.getProfile,
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderNoProductsSection = () => (
    <div className="no-products-section">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-failure-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  convertToCamelCase = list => ({
    companyLogoUrl: list.company_logo_url,
    employmentType: list.employment_type,
    id: list.id,
    jobDescription: list.job_description,
    location: list.location,
    packagePerAnnum: list.package_per_annum,
    rating: list.rating,
    title: list.title,
  })

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    const lengthOfJobsList = jobsList.length
    const updatedList = jobsList.map(each => this.convertToCamelCase(each))
    if (lengthOfJobsList === 0) {
      return this.renderNoProductsSection()
    }

    return (
      <ul className="success-jobs-container">
        {updatedList.map(each => (
          <JobItems List={each} key={each.id} />
        ))}
      </ul>
    )
  }

  onClickJobsFailureBtn = () => {
    this.setState(
      {
        jobsApiStatus: apiStatusConstants.inProgress,
      },
      this.getJobs,
    )
  }

  renderJobsFailure = () => (
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

  renderProfileContainer = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderApiProfileSuccess()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  renderMobileJobsContainer = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccess()

      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderJobsFailure()
      default:
        return null
    }
  }

  render() {
    const {EType, minPackage} = this.state
    console.log('Etype=', EType)
    console.log('Min package=', minPackage)
    return (
      <div className="bg-container">
        <Header />
        <div className="jobs-bottom-container">
          <div className="bottom-container">
            <div className="mobile-profile-container">
              <div className="search-container">
                <input
                  type="search"
                  placeholder="Search"
                  className="input-element"
                  onChange={this.onChangeJobSearch}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-btn"
                  onClick={this.onClickSearchBtn}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>

              {this.renderProfileContainer()}
              <hr className="horizontail-line" />
              <ul className="unordered-employment-container">
                <h1>Types of Employment</h1>
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId} className="employment-item">
                    <input
                      type="checkbox"
                      id={each.label}
                      onClick={this.onChangeCheckBox}
                      value={each.employmentTypeId}
                    />
                    <label htmlFor={each.label}>{each.label}</label>
                  </li>
                ))}
              </ul>
              <hr className="horizontail-line" />
              <ul className="unordered-employment-container">
                <h1>Salary Range</h1>
                {salaryRangesList.map(each => (
                  <li key={each.employmentTypeId} className="employment-item">
                    <input
                      type="radio"
                      id={each.label}
                      name="salary"
                      value={each.salaryRangeId}
                      onClick={this.onClickRadioInput}
                    />
                    <label htmlFor={each.label}>{each.label}</label>
                  </li>
                ))}
              </ul>
              {this.renderMobileJobsContainer()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
