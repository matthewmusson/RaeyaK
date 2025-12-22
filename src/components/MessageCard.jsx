import { useState, useRef, useEffect } from 'react'
import './MessageCard.css'

function MessageCard({ message, onDelete, onNameClick }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const modalRef = useRef(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatModalDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Truncate message to approximately 2 paragraphs (around 300 characters)
  const truncateMessage = (text) => {
    const maxLength = 300
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const isTruncated = message.text.length > 300

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && modalRef.current && !modalRef.current.contains(event.target)) {
        setIsExpanded(false)
        setShowDeleteConfirm(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  const handleDelete = () => {
    onDelete(message.id)
    setIsExpanded(false)
    setShowDeleteConfirm(false)
  }

  const handleNameClick = (e) => {
    e.stopPropagation()
    setIsExpanded(false)
    onNameClick(message.name)
  }

  return (
    <>
      <div className="message-card" onClick={() => setIsExpanded(true)}>
        <div className="message-timestamp">
          {formatDate(message.date)}
        </div>
        <div className="message-content">
          <p>{truncateMessage(message.text)}</p>
          <p className="message-signature">
            — <span className="name-link" onClick={handleNameClick}>{message.name}</span>
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="modal-overlay">
          <div className="modal-card" ref={modalRef}>
            <div className="modal-header">
              <div className="modal-actions">
                <button
                  className="delete-button"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete message"
                >
                  ×
                </button>
                <button
                  className="minimize-button"
                  onClick={() => setIsExpanded(false)}
                  title="Minimize"
                >
                  −
                </button>
              </div>
              <div className="modal-date">
                {formatModalDate(message.date)}
              </div>
            </div>
            <div className="modal-content">
              <p>{message.text}</p>
              <p className="message-signature">
                — <span className="name-link" onClick={handleNameClick}>{message.name}</span>
              </p>
            </div>

            {showDeleteConfirm && (
              <div className="delete-confirm">
                <p>Are you sure you want to delete this message?</p>
                <div className="confirm-actions">
                  <button className="confirm-yes" onClick={handleDelete}>Yes, Delete</button>
                  <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default MessageCard

