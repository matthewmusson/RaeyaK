import { useState, useRef, useEffect } from 'react'
import { familyMembers } from '../data/familyMembers'
import './AddMessage.css'

function AddMessage({ onAddMessage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedName.trim()) {
      return
    }

    const newMessage = {
      id: Date.now(),
      text: messageText.trim(),
      name: selectedName.trim(),
      date: new Date().toISOString().split('T')[0]
    }

    onAddMessage(newMessage)
    
    // Reset form
    setMessageText('')
    setSelectedName('')
    setSearchQuery('')
    setIsOpen(false)
    setShowDropdown(false)
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
    <div className="add-message-container">
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

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={!messageText.trim() || !selectedName.trim()}>
            Add Message
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => {
              setIsOpen(false)
              setMessageText('')
              setSelectedName('')
              setSearchQuery('')
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMessage

