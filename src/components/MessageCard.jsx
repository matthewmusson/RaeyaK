import { useState, useRef, useEffect } from 'react'
import './MessageCard.css'

function MessageCard({ message, onDelete, onNameClick, onEdit }) {
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

  const handleEdit = () => {
    onEdit(message)
    setIsExpanded(false)
  }

  return (
    <>
      <div className="message-card" onClick={() => setIsExpanded(true)}>
        <div className="message-timestamp">
          {formatDate(message.date)}
        </div>
        <div className="message-content">
          <p>{truncateMessage(message.text)}</p>

          {/* Media indicators */}
          {(message.photos?.length > 0 || message.videos?.length > 0 || message.audio) && (
            <div className="media-indicators">
              {message.photos?.length > 0 && (
                <span className="media-badge">📷 {message.photos.length} photo{message.photos.length > 1 ? 's' : ''}</span>
              )}
              {message.videos?.length > 0 && (
                <span className="media-badge">🎥 {message.videos.length} video{message.videos.length > 1 ? 's' : ''}</span>
              )}
              {message.audio && (
                <span className="media-badge">🎵 Audio</span>
              )}
            </div>
          )}

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
                  className="edit-button"
                  onClick={handleEdit}
                  title="Edit message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className="delete-button"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Delete message"
                >
                  ×
                </button>
              </div>
              <div className="modal-date">
                {formatModalDate(message.date)}
              </div>
            </div>
            <div className="modal-content">
              <p>{message.text}</p>

              {/* Display photos */}
              {message.photos && message.photos.length > 0 && (
                <div className="media-section">
                  <h4>Photos</h4>
                  <div className="media-grid">
                    {message.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        className="media-photo"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Display videos */}
              {message.videos && message.videos.length > 0 && (
                <div className="media-section">
                  <h4>Videos</h4>
                  <div className="media-grid">
                    {message.videos.map((video, index) => (
                      <video
                        key={index}
                        src={video.url}
                        controls
                        className="media-video"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Display audio */}
              {message.audio && (
                <div className="media-section">
                  <h4>Audio Message</h4>
                  <audio src={message.audio.url} controls className="media-audio" />
                </div>
              )}

              <p className="message-signature">
                — <span className="name-link" onClick={handleNameClick}>{message.name}</span>
              </p>
            </div>

            {showDeleteConfirm && (
              <div className="delete-confirm">
                <div className="confirm-actions">
                  <button className="confirm-yes" onClick={handleDelete}>Delete</button>
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

