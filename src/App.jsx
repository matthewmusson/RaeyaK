import { useState } from 'react'
import Home from './components/Home'
import AddMessage from './components/AddMessage'
import { messages as initialMessages } from './data/messages'
import { familyMembers as familyMembersList } from './data/familyMembers'
import './App.css'

function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('All')

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

  return (
    <div className="App">
      <Home 
        messages={sortedMessages}
        familyMembers={familyMembers}
        selectedFamilyMember={selectedFamilyMember}
        onFamilyMemberSelect={setSelectedFamilyMember}
      />
      <AddMessage onAddMessage={handleAddMessage} />
    </div>
  )
}

export default App

