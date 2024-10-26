"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookHeadphones, Clapperboard, FileStack, FileVideo, MessageCircle, MessageCircleQuestion, Share, Star, Video } from 'lucide-react'
export default function Page(){
    const router = useRouter() 
    return(
        <div className="flex h-screen text-white bg-[#0e1111]">
        <Sidebar/>
        <main className="flex-1 flex flex-col rounded-xl m-4 bg-white text-slate-700">
          <header className="flex justify-between items-center p-4 border-b border-gray-400">
            <h1 className="text-xl font-semibold">Dashboard</h1>
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
            <h1 className='text-2xl font-semibold text-center my-5'>What would you like to do ?</h1>
            <div className='grid grid-cols-2 gap-2'>
                <p className=' flex items-center gap-2 p-4 bg-green-300 text-green-700 rounded-lg cursor-pointer' onClick={() => router.push('/Chat')}><Clapperboard/> Chat with a video</p>
                <p className=' flex items-center gap-2 p-4 bg-yellow-300 text-yellow-700 rounded-lg cursor-pointer' onClick={() => router.push('/Quiz')}><MessageCircleQuestion /> Do a quiz</p>
                <p className=' flex items-center gap-2 p-4 bg-blue-300 text-blue-700 rounded-lg cursor-pointer' onClick={() => router.push('/Flashcards')}><FileStack/> Look at some flashcards</p>
                <p className=' flex items-center gap-2 p-4 bg-orange-300 text-orange-700 rounded-lg cursor-pointer' onClick={() => router.push('/Podcasts')}><BookHeadphones/> Listen to a podcast</p>
            </div>
          </div>
          
        </main>
      </div>  
    )
}