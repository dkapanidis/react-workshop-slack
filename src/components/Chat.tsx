import { FlashOn, InfoOutlined, StarOutline } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import db from '../firebase'
import QueryParams from '../models/QueryParams'
import { useStateValue } from '../StateProvider'
import firebase from 'firebase'

interface Channel {
  name: string,
}

interface ChannelMessages {
  message: string,
  timestamp: any,
  user: string,
  userImage: string,
}

function Chat() {
  const { channelID } = useParams<QueryParams>();
  const [channel, setChannel] = useState<Channel | undefined>()

  useEffect(() => {
    if (channelID) {
      db.collection('channels').doc(channelID).onSnapshot(snapshot =>
        setChannel(snapshot.data() as Channel)
      )
    }
  }, [channelID])

  return (
    <div className="flex flex-col flex-grow">
      <div className="space-y-0.5 bg-gray-700 flex flex-col flex-grow overflow-hidden">
        <ChatTop channel={channel} />
        <ChatMessages />
      </div>
      <ChatInput channelID={channelID} />
    </div>
  )
}

interface ChatTopProps { channel: Channel | undefined }
function ChatTop({ channel }: ChatTopProps) {
  return (
    <div className="flex px-4 bg-gray-800 h-16 items-center">
      <div>
        <div className="space-x-2">
          <span className="font-bold text-sm">#{channel?.name}</span>
          <span className="text-base"><StarOutline fontSize="inherit" /></span>
        </div>
        <span className="font-light text-sm">Add a topic</span>
      </div>
      <div className="flex-grow" />
      <InfoOutlined />
    </div>
  )
}

function ChatMessages() {
  const { channelID } = useParams<QueryParams>();
  const [channelMessages, setChannelMessages] = useState<ChannelMessages[] | []>([])
  useEffect(() => {
    if (channelID) {
      db.collection('channels')
        .doc(channelID)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot =>
          setChannelMessages(snapshot.docs.map((doc) => doc.data()) as any)
        )
    }
  }, [channelID])
  return (
    <div className="flex flex-col flex-grow px-8 py-4 bg-gray-800 overflow-auto">
      {channelMessages.map((msg: any) => (
        <ChatMessage key={msg?.timestamp} message={msg} />
      ))}
    </div>
  )
}

interface ChatMessageProps { message: ChannelMessages }
function ChatMessage({ message }: ChatMessageProps) {
  const color = getUserColor(message.user)
  // retrieve from message timestamp or calculate from local time (for messages that are still on-the-fly)
  const date = new Date(message.timestamp ? message.timestamp.toDate() : Date.now())
  return (
    <div>
      <span className="text-gray-400 text-xs pr-3 font-mono">{date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })}</span>
      <span className={`${color} text-sm pr-2`}>{message.user}</span>
      <span className="text-gray-200 text-sm">{message.message}</span>
    </div>
  )
}

function getUserColor(text: string) {
  const colors = ["text-green-500", "text-blue-500", "text-pink-500", "text-indigo-500", "text-purple-500", "text-yellow-500", "text-red-500"]
  var hash = 0;
  if (text.length === 0) return hash;
  for (var i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  hash = ((hash % colors.length) + colors.length) % colors.length;
  return colors[hash];
}

interface ChatInputProps { channelID: string }
function ChatInput({ channelID }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [{ user }] = useStateValue() as any;

  const sendMessage = (e: any) => {
    console.log('sending msg', channelID)
    e.preventDefault();
    if (channelID) {
      db.collection('channels').doc(channelID)
        .collection('messages').add({
          message: input,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: user.displayName,
          userImage: user.photoURL,
        })
      setInput("")
    }
  }

  return (
    <form className="px-5 pb-5">
      <div className="px-2 p-2 rounded-md border-gray-500 border flex space-x-4 text-gray-400">
        <FlashOn className="pr-2 border-r border-gray-500" />
        <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} className="text-white placeholder-gray-500 bg-transparent outline-none flex-auto" placeholder="Type your message..."></input>
        <button type="submit" onClick={sendMessage} />
      </div>
    </form>
  )
}

export default Chat
