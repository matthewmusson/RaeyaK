import { useState, useEffect } from 'react'
import Home from './components/Home'
import AddMessage from './components/AddMessage'
import { messages as initialMessages } from './data/messages'
import { familyMembers as familyMembersList } from './data/familyMembers'
import './App.css'

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('All')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode to body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  // Get family members with 'All' option
  const familyMembers = ['All', ...familyMembersList]

  // Filter messages based on selected family member
  const filteredMessages = selectedFamilyMember === 'All'
    ? messages
    : messages.filter(msg => msg.name.trim() === selectedFamilyMember)

  // Sort by date (most recent first)
  const sortedMessages = [...filteredMessages].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  )

  const handleAddMessage = (newMessage) => {
    setMessages([newMessage, ...messages])
  }

  const handleDeleteMessage = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Home
        messages={sortedMessages}
        familyMembers={familyMembers}
        selectedFamilyMember={selectedFamilyMember}
        onFamilyMemberSelect={setSelectedFamilyMember}
        onDeleteMessage={handleDeleteMessage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <AddMessage onAddMessage={handleAddMessage} />
    </div>
  )
}

export default App

