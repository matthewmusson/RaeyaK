import { useState, useRef, useEffect } from 'react'
import { familyMembers } from '../data/familyMembers'
import './EditMessage.css'

function EditMessage({ message, onUpdateMessage, onClose }) {
  const [messageText, setMessageText] = useState(message.text)
  const [selectedName, setSelectedName] = useState(message.name)
  const [searchQuery, setSearchQuery] = useState(message.name)
  const [showDropdown, setShowDropdown] = useState(false)
  const [newPhotos, setNewPhotos] = useState([])
  const [newVideos, setNewVideos] = useState([])
  const [newAudio, setNewAudio] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingPhotos, setExistingPhotos] = useState(message.photos || [])
  const [existingVideos, setExistingVideos] = useState(message.videos || [])
  const [existingAudio, setExistingAudio] = useState(message.audio)
  const [deletedPhotos, setDeletedPhotos] = useState([])
  const [deletedVideos, setDeletedVideos] = useState([])
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const audioInputRef = useRef(null)

  // Filter family members based on search query
  const filteredMembers = familyMembers.filter(member =>
    member.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedName.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const updates = {
        text: messageText.trim(),
        name: selectedName.trim(),
        photos: existingPhotos,
        videos: existingVideos
      }

      // Only add new media if provided
      if (newPhotos.length > 0) {
        updates.newPhotos = newPhotos
      }

      if (newVideos.length > 0) {
        updates.newVideos = newVideos
      }

      // Add deleted media arrays
      if (deletedPhotos.length > 0) {
        updates.deletedPhotos = deletedPhotos
      }

      if (deletedVideos.length > 0) {
        updates.deletedVideos = deletedVideos
      }

      if (newAudio) {
        updates.newAudio = newAudio
        updates.oldAudioPath = message.audio?.path
      } else if (!existingAudio && message.audio) {
        // Audio was deleted
        updates.deleteAudio = true
        updates.oldAudioPath = message.audio?.path
      }

      await onUpdateMessage(message.id, updates)
      onClose()
    } catch (error) {
      console.error('Error updating message:', error)
      alert('Failed to update message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setNewPhotos(prev => [...prev, ...files])
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files)
    setNewVideos(prev => [...prev, ...files])
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    setNewAudio(file)
  }

  const removeNewPhoto = (index) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewVideo = (index) => {
    setNewVideos(prev => prev.filter((_, i) => i !== index))
  }

  const removeNewAudio = () => {
    setNewAudio(null)
  }

  const removeExistingPhoto = (index) => {
    const photoToDelete = existingPhotos[index]
    setDeletedPhotos(prev => [...prev, photoToDelete])
    setExistingPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingVideo = (index) => {
    const videoToDelete = existingVideos[index]
    setDeletedVideos(prev => [...prev, videoToDelete])
    setExistingVideos(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingAudio = () => {
    setExistingAudio(null)
  }

  const handleNameSelect = (name) => {
    setSelectedName(name)
    setSearchQuery(name)
    setShowDropdown(false)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setShowDropdown(true)
    if (!e.target.value) {
      setSelectedName('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredMembers.length === 1) {
      e.preventDefault()
      handleNameSelect(filteredMembers[0])
    }
  }

  return (
    <div className="edit-message-overlay">
      <div className="edit-message-container" ref={modalRef}>
        <form onSubmit={handleSubmit} className="edit-message-form">
          <div className="form-header">
            <h2>Edit Message</h2>
            <button
              type="button"
              className="close-button"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="edit-message-text">Message:</label>
            <textarea
              id="edit-message-text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write your message here..."
              rows={6}
              className="message-textarea"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-name-select">From:</label>
            <div className="name-select-wrapper">
              <input
                ref={inputRef}
                id="edit-name-select"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search and select a name..."
                className="name-input"
                autoComplete="off"
              />
              {showDropdown && filteredMembers.length > 0 && (
                <div ref={dropdownRef} className="name-dropdown">
                  {filteredMembers.map((member) => (
                    <div
                      key={member}
                      className={`name-option ${selectedName === member ? 'selected' : ''}`}
                      onClick={() => handleNameSelect(member)}
                    >
                      {member}
                    </div>
                  ))}
                </div>
              )}
              {showDropdown && searchQuery && filteredMembers.length === 0 && (
                <div ref={dropdownRef} className="name-dropdown">
                  <div className="name-option no-results">No matching names found</div>
                </div>
              )}
            </div>
          </div>

          {/* Existing media with delete options */}
          {(existingPhotos.length > 0 || existingVideos.length > 0 || existingAudio) && (
            <div className="existing-media-section">
              <h4>Current Media</h4>
              {existingPhotos.length > 0 && (
                <div className="existing-media-list">
                  <p className="media-type-label">Photos:</p>
                  {existingPhotos.map((photo, index) => (
                    <div key={index} className="existing-media-item">
                      <span className="media-item-name">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        {photo.name || `Photo ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(index)}
                        className="remove-existing-media-button"
                        title="Remove photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {existingVideos.length > 0 && (
                <div className="existing-media-list">
                  <p className="media-type-label">Videos:</p>
                  {existingVideos.map((video, index) => (
                    <div key={index} className="existing-media-item">
                      <span className="media-item-name">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                        {video.name || `Video ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExistingVideo(index)}
                        className="remove-existing-media-button"
                        title="Remove video"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {existingAudio && (
                <div className="existing-media-list">
                  <p className="media-type-label">Audio:</p>
                  <div className="existing-media-item">
                    <span className="media-item-name">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18V5l12-2v13"/>
                        <circle cx="6" cy="18" r="3"/>
                        <circle cx="18" cy="16" r="3"/>
                      </svg>
                      {existingAudio.name || 'Audio message'}
                    </span>
                    <button
                      type="button"
                      onClick={removeExistingAudio}
                      className="remove-existing-media-button"
                      title="Remove audio"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <div className="upload-section-header">
              <label>Photos</label>
              <button
                type="button"
                className="toggle-upload-button"
                onClick={() => photoInputRef.current?.click()}
                title="Add photos"
              >
                +
              </button>
            </div>
            <input
              ref={photoInputRef}
              id="edit-photos-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden-file-input"
            />
            {newPhotos.length > 0 && (
              <div className="file-preview-list">
                {newPhotos.map((photo, index) => (
                  <div key={index} className="file-preview-item">
                    <span className="file-name">{photo.name}</span>
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(index)}
                      className="remove-file-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="upload-section-header">
              <label>Videos</label>
              <button
                type="button"
                className="toggle-upload-button"
                onClick={() => videoInputRef.current?.click()}
                title="Add videos"
              >
                +
              </button>
            </div>
            <input
              ref={videoInputRef}
              id="edit-videos-upload"
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoChange}
              className="hidden-file-input"
            />
            {newVideos.length > 0 && (
              <div className="file-preview-list">
                {newVideos.map((video, index) => (
                  <div key={index} className="file-preview-item">
                    <span className="file-name">{video.name}</span>
                    <button
                      type="button"
                      onClick={() => removeNewVideo(index)}
                      className="remove-file-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="upload-section-header">
              <label>Audio</label>
              <button
                type="button"
                className="toggle-upload-button"
                onClick={() => audioInputRef.current?.click()}
                title="Add audio"
              >
                +
              </button>
            </div>
            <input
              ref={audioInputRef}
              id="edit-audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="hidden-file-input"
            />
            {newAudio && (
              <div className="file-preview-list">
                <div className="file-preview-item">
                  <span className="file-name">{newAudio.name}</span>
                  <button
                    type="button"
                    onClick={removeNewAudio}
                    className="remove-file-button"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={!messageText.trim() || !selectedName.trim() || isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMessage
