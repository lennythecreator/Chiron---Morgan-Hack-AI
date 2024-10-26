"use client"
import { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowUp, Share, Star, X } from 'lucide-react'

interface Message {
  id: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showVideoPrompt, setShowVideoPrompt] = useState(true)
  const [hasVideo, setHasVideo] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

    async function Chat(){
      const res = await fetch('http://localhost:5000/chat',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
  
        },
        body: JSON.stringify({
          prompt: currentMessage,
          style: 'sarcastic',
          index: 'chiron2'
        })
      })
      const data = await res.json()
      setIsLoading(false)
      setMessages((prev) => [...prev, data])
      console.log(data)
    }
  
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleVideoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('video', file)

    try {
      setIsLoading(true)
      const response = await fetch('YOUR_API_ENDPOINT/upload-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Video upload failed')
      
      setVideoFile(file)
      setHasVideo(true)
    } catch (error) {
      console.error('Error uploading video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      isAi: false,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newMessage])
    setCurrentMessage('')
    setIsLoading(true)
    Chat()
  }

  return (
    <div className="flex h-screen text-white bg-[#0e1111]">
      <Dialog open={showVideoPrompt} onOpenChange={setShowVideoPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Would you like to chat about a video?</DialogTitle>
            <DialogDescription>
              Upload a video to get AI assistance with understanding its content
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setShowVideoPrompt(false)}>
                No, just chat
              </Button>
              <label className="cursor-pointer">
                <Button className="w-full" asChild>
                  <div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleVideoUpload(file)
                          setShowVideoPrompt(false)
                        }
                      }}
                    />
                    Yes, upload video
                  </div>
                </Button>
              </label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Sidebar />
      
      <main className="flex-1 flex flex-col rounded-xl m-4 bg-white text-slate-700">
        <header className="flex justify-between items-center p-4 border-b border-gray-400">
          <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto p-4" ref={chatContainerRef}>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.content}
                isAi={msg.isAi}
              />
            ))}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>

          {hasVideo && (
            <div className="w-80 p-4 border-l border-gray-200">
              <div className="sticky top-0">
                <div className="relative">
                  <video
                    className="w-full rounded-lg"
                    src={videoFile ? URL.createObjectURL(videoFile) : ''}
                    controls
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                    onClick={() => setHasVideo(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="mt-4 font-semibold">Video Analysis</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Ask questions about the video content and I'll help you understand it better.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="p-4 border-t border-gray-300">
          <div className="flex items-center space-x-2 max-w-3xl mx-auto">
            <Input
              className="flex-1"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  )
}

const ChatMessage = ({ isAi, message }: { isAi: boolean; message: string }) => {
  return (
    <div className="relative w-full max-w-3xl mx-auto mb-8">
      <div className={`relative p-4 rounded-lg z-10 ${
        isAi 
          ? 'bg-gray-100 mr-12 text-end' 
          : 'bg-green-400 text-white ml-12'
      }`}>
        {message}
      </div>
    
      <Avatar className={`absolute mr-4 -bottom-5 w-12 h-12 rounded-lg z-10 ${
        isAi
          ? 'left-0 ml-4'
          : 'right-0'
      }`}>
        <AvatarImage 
          src={isAi ? "https://scontent-lga3-1.xx.fbcdn.net/o1/v/t0/f1/m340/genai_m4_lla_odn_v3:upload_img_48772412_10_26_2024_06_46_23_152528_1158433480636273255.jpeg?_nc_ht=scontent-lga3-1.xx.fbcdn.net&_nc_cat=104&ccb=9-4&oh=00_AYB6fhExnZd3Tl_vncD7ny43E7SlBQUaNOzXn7dXG1ZfaQ&oe=671EC91D&_nc_sid=5b3566" : "https://github.com/shadcn.png"} 
          alt={isAi ? "AI Bot" : "User"} 
        />
        <AvatarFallback>{isAi ? "AI" : "U"}</AvatarFallback>
      </Avatar>
    </div>
  )
}