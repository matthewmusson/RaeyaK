import { useState } from 'react'
import MessageCard from './MessageCard'
import './Home.css'

function Home({ messages, familyMembers, selectedFamilyMember, onFamilyMemberSelect, onDeleteMessage, isDarkMode, onToggleDarkMode }) {
  // Limit to 30 cards
  const displayedMessages = messages.slice(0, 30)

  const handleNameClick = (name) => {
    onFamilyMemberSelect(name)
  }

  // Group messages by year and month
  const groupedMessages = displayedMessages.reduce((acc, message) => {
    const date = new Date(message.date)
    const year = date.getFullYear()
    const month = date.toLocaleDateString('en-US', { month: 'long' })

    if (!acc[year]) {
      acc[year] = {}
    }
    if (!acc[year][month]) {
      acc[year][month] = []
    }
    acc[year][month].push(message)

    return acc
  }, {})

  // Sort years descending (most recent first)
  const sortedYears = Object.keys(groupedMessages).sort((a, b) => b - a)

  // Month order for sorting
  const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="home">
      <header className="home-header">
        <h1>Messages for Raeya</h1>
        <button className="dark-mode-toggle" onClick={onToggleDarkMode} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {isDarkMode ? (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
      </header>

      <div className="tabs">
        {familyMembers.map(member => (
          <button
            key={member}
            className={`tab ${selectedFamilyMember === member ? 'active' : ''}`}
            onClick={() => onFamilyMemberSelect(member)}
          >
            {member}
          </button>
        ))}
      </div>

      <div className="messages-container">
        {displayedMessages.length === 0 ? (
          <p className="no-messages">No messages found.</p>
        ) : (
          sortedYears.map(year => {
            const months = Object.keys(groupedMessages[year])
            // Sort months in descending order (most recent first)
            const sortedMonths = months.sort((a, b) => monthOrder.indexOf(b) - monthOrder.indexOf(a))

            return (
              <div key={year} className="year-section">
                <h2 className="year-heading">{year}</h2>
                {sortedMonths.map(month => (
                  <div key={`${year}-${month}`} className="month-section">
                    <h3 className="month-heading">{month}</h3>
                    <div className="messages-grid">
                      {groupedMessages[year][month].map((message, index) => (
                        <MessageCard
                          key={`${message.id}-${index}`}
                          message={message}
                          onDelete={onDeleteMessage}
                          onNameClick={handleNameClick}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Home

