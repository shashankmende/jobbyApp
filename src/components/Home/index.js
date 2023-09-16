import './index.css'
import Header from '../Header'

const Home = () => (
  <div className="home-container">
    <Header />
    <div className="text-top-container">
      <div className="text-container">
        <h1>
          Find The Job That
          <br /> Fits Your Life
        </h1>
        <p>
          Millions of people are searching for jobs, salary
          <br /> information,company reviews. Find the job that fits your
          <br /> abilities and potenital
        </p>
        <button className="find-jobs-btn" type="button">
          Find Jobs
        </button>
      </div>
    </div>
  </div>
)

export default Home
