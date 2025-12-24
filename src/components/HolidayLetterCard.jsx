import { useNavigate } from 'react-router-dom'
import './HolidayLetterCard.css'

function HolidayLetterCard({ year }) {
  const navigate = useNavigate()

  return (
    <div className="holiday-letter-card" onClick={() => navigate(`/holiday-letter-${year}`)}> 
      <div className="holiday-card-content">
        <div className="holiday-card-text">
          Holiday Letter {year}
        </div>
      </div>
    </div>
  )
}

export default HolidayLetterCard
