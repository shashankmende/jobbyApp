import './index.css'

const SkillItems = props => {
  const {skills} = props
  const {imageUrl, name} = skills
  console.log('skills from items', skills)

  return (
    <li className="skill-item">
      <img src={imageUrl} alt={name} className="skill-img" />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillItems
