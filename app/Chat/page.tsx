"use client"
import { useState } from 'react'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, BookHeadphones, Clapperboard, FileStack, FileVideo, MessageCircle, MessageCircleQuestion, Share, Star, Video } from 'lucide-react'
export default function page() {
    const [message, setMessage] = useState('')
    
    return (
    <div className="flex h-screen text-white bg-[#0e1111]">
        <Sidebar/>
        <main className="flex-1 flex flex-col rounded-xl m-4 bg-white text-slate-700">
          <header className="flex justify-between items-center p-4 border-b border-gray-400">
            <h1 className="text-xl font-semibold">Chat</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4">
            <div>
                <div className=''>
                    <ChatMessage 
                        message="Hi can you help me with this issue that i've been having lately it would i'm trying to understand for loops from this lecture but it's really confusing"
                        isAi={false}
                    />
                    <ChatMessage
                        message="Ok can you go into detail about what you're trying to ask so i can help"
                        isAi={true}
                    />
                </div>
            </div>
          </div>
           <footer className="p-4 border-t border-gray-300">
                <div className="flex items-center space-x-2 justify-center">
                    <Input className="w-[60%]" placeholder="Type a message..." 
                    />
                    <Button className=''><ArrowUp/></Button>
                </div>
            </footer>
        </main>
      </div> 
  )
}

const ChatMessage = ({ isAi, message }) => {
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
        </Avatar>
      </div>
    );
}
