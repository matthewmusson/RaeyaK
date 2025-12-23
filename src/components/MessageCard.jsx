import { useState, useRef, useEffect } from 'react'
import './MessageCard.css'

function MessageCard({ message, onDelete, onNameClick, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [playingVideo, setPlayingVideo] = useState(null)
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
                <span className="media-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  {message.photos.length} photo{message.photos.length > 1 ? 's' : ''}
                </span>
              )}
              {message.videos?.length > 0 && (
                <span className="media-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                  {message.videos.length} video{message.videos.length > 1 ? 's' : ''}
                </span>
              )}
              {message.audio && (
                <span className="media-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                  Audio
                </span>
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
                        onClick={(e) => {
                          e.stopPropagation()
                          setFullscreenImage(photo.url)
                        }}
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
                      <div
                        key={index}
                        className="video-thumbnail"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPlayingVideo(video.url)
                        }}
                      >
                        <video
                          src={video.url}
                          className="media-video"
                        />
                        <div className="play-overlay">
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="white" opacity="0.9">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
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

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setFullscreenImage(null)
          }
        }}>
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="fullscreen-image"
          />
          <button className="close-fullscreen" onClick={() => {
            setFullscreenImage(null)
          }}>×</button>
        </div>
      )}

      {playingVideo && (
        <div className="fullscreen-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setPlayingVideo(null)
          }
        }}>
          <video
            src={playingVideo}
            controls
            autoPlay
            className="fullscreen-video"
          />
          <button className="close-fullscreen" onClick={() => {
            setPlayingVideo(null)
          }}>×</button>
        </div>
      )}
    </>
  )
}

export default MessageCard

