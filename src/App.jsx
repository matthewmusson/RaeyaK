import { useState, useEffect } from 'react'
import Home from './components/Home'
import AddMessage from './components/AddMessage'
import EditMessage from './components/EditMessage'
import { familyMembers as familyMembersList } from './data/familyMembers'
import { getMessages, addMessage, updateMessage, deleteMessage } from './firebase/messageService'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('All')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [editingMessage, setEditingMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load messages from Firebase on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const fetchedMessages = await getMessages()
        setMessages(fetchedMessages)
      } catch (error) {
        console.error('Error loading messages:', error)
        alert('Failed to load messages. Please check your Firebase configuration.')
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

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

  const handleAddMessage = async (messageData) => {
    try {
      const newMessage = await addMessage(messageData)
      setMessages([newMessage, ...messages])
    } catch (error) {
      console.error('Error adding message:', error)
      throw error
    }
  }

  const handleUpdateMessage = async (messageId, updates) => {
    try {
      await updateMessage(messageId, updates)

      // Refresh messages from Firebase to get updated data
      const updatedMessages = await getMessages()
      setMessages(updatedMessages)
      setEditingMessage(null)
    } catch (error) {
      console.error('Error updating message:', error)
      throw error
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      const messageToDelete = messages.find(msg => msg.id === messageId)
      const mediaFiles = {
        photos: messageToDelete?.photos || [],
        videos: messageToDelete?.videos || [],
        audio: messageToDelete?.audio
      }

      await deleteMessage(messageId, mediaFiles)
      setMessages(messages.filter(msg => msg.id !== messageId))
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message. Please try again.')
    }
  }

  const handleEditMessage = (message) => {
    setEditingMessage(message)
  }

  if (isLoading) {
    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="loading-container">
          <p>Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Home
        messages={sortedMessages}
        familyMembers={familyMembers}
        selectedFamilyMember={selectedFamilyMember}
        onFamilyMemberSelect={setSelectedFamilyMember}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      <AddMessage onAddMessage={handleAddMessage} />
      {editingMessage && (
        <EditMessage
          message={editingMessage}
          onUpdateMessage={handleUpdateMessage}
          onClose={() => setEditingMessage(null)}
        />
      )}
    </div>
  )
}

export default App

