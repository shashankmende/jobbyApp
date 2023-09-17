import './index.css'
import {AiFillStar} from 'react-icons/ai'

import {IoLocationSharp} from 'react-icons/io5'
import {BsBagFill} from 'react-icons/bs'

const JobItems = props => {
  const {List} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = List

  return (
    <li className="job-description-container">
      <div className="company-container">
        <img src={companyLogoUrl} alt="company logo" className="company-logo" />
        <div className="designation-container">
          <h1 className="designation">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="star-image" />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="location-job-salary-container">
        <div className="location-job-container">
          <div className="location-container">
            <IoLocationSharp />
            <p>{location}</p>
          </div>
          <div className="location-container">
            <BsBagFill />
            <p>{employmentType}</p>
          </div>
        </div>
        <p className="package">{packagePerAnnum}</p>
      </div>
      <hr className="horizontal-line" />
      <p className="job-description">{jobDescription}</p>
    </li>
  )
}

export default JobItems
