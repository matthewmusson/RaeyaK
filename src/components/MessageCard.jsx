import './MessageCard.css'

function MessageCard({ message }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="message-card">
      <div className="message-timestamp">
        {formatDate(message.date)}
      </div>
      <div className="message-content">
        <p>{message.text}</p>
        <p className="message-signature">— {message.name}</p>
      </div>
    </div>
  )
}

export default MessageCard

