import { useState } from 'react'
import MessageCard from './MessageCard'
import './Home.css'

function Home({ messages, familyMembers, selectedFamilyMember, onFamilyMemberSelect }) {
  return (
    <div className="home">
      <header className="home-header">
        <h1>Messages for Raeya</h1>
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

      <div className="messages-grid">
        {messages.length === 0 ? (
          <p className="no-messages">No messages found.</p>
        ) : (
          messages.map((message, index) => (
            <MessageCard key={index} message={message} />
          ))
        )}
      </div>
    </div>
  )
}

export default Home

