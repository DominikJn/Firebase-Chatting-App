import React from 'react'
import type MessageData from '../types/MessageData'

interface MessageProps {
    message: MessageData
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div>{message.text}</div>
  )
}

export default Message