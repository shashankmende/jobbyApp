import './index.css'

const SkillItems = props => {
  const {skills} = props
  console.log('skills from items', skills)

  const renderListItems = () => (
    <ul className="skills-container">
      {skills.map(each => (
        <li className="skill-item">
          <img src={each.imageUrl} alt={each.name} className="skill-img" />
          <p className="skill-name">{each.name}</p>
        </li>
      ))}
    </ul>
  )

  return renderListItems()
}

export default SkillItems
