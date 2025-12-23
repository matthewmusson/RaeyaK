import { useState, useRef, useEffect } from 'react'
import { familyMembers } from '../data/familyMembers'
import './AddMessage.css'

function AddMessage({ onAddMessage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [audio, setAudio] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedName.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const messageData = {
        text: messageText.trim(),
        name: selectedName.trim(),
        photos: photos,
        videos: videos,
        audio: audio
      }

      await onAddMessage(messageData)

      // Reset form
      setMessageText('')
      setSelectedName('')
      setSearchQuery('')
      setPhotos([])
      setVideos([])
      setAudio(null)
      setIsOpen(false)
      setShowDropdown(false)
    } catch (error) {
      console.error('Error adding message:', error)
      alert('Failed to add message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos(prev => [...prev, ...files])
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files)
    setVideos(prev => [...prev, ...files])
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    setAudio(file)
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index))
  }

  const removeAudio = () => {
    setAudio(null)
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

  if (!isOpen) {
    return (
      <button className="add-message-toggle" onClick={() => setIsOpen(true)}>
        + Add Message
      </button>
    )
  }

  return (
    <div className="add-message-backdrop">
      <div className="add-message-container" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="add-message-form">
        <div className="form-header">
          <h2>Add a Message</h2>
          <button
            type="button"
            className="close-button"
            onClick={() => {
              setIsOpen(false)
              setMessageText('')
              setSelectedName('')
              setSearchQuery('')
              setPhotos([])
              setVideos([])
              setAudio(null)
            }}
          >
            ×
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="message-text">Message:</label>
          <textarea
            id="message-text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Write your message here..."
            rows={6}
            className="message-textarea"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="name-select">From:</label>
          <div className="name-select-wrapper">
            <input
              ref={inputRef}
              id="name-select"
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
            id="photos-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden-file-input"
          />
          {photos.length > 0 && (
            <div className="file-preview-list">
              {photos.map((photo, index) => (
                <div key={index} className="file-preview-item">
                  <span className="file-name">{photo.name}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
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
            id="videos-upload"
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
            className="hidden-file-input"
          />
          {videos.length > 0 && (
            <div className="file-preview-list">
              {videos.map((video, index) => (
                <div key={index} className="file-preview-item">
                  <span className="file-name">{video.name}</span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
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
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="hidden-file-input"
          />
          {audio && (
            <div className="file-preview-list">
              <div className="file-preview-item">
                <span className="file-name">{audio.name}</span>
                <button
                  type="button"
                  onClick={removeAudio}
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
            {isSubmitting ? 'Adding...' : 'Add Message'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setIsOpen(false)
              setMessageText('')
              setSelectedName('')
              setSearchQuery('')
              setPhotos([])
              setVideos([])
              setAudio(null)
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default AddMessage

