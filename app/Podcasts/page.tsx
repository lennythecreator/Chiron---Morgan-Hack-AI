"use client"
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Share, Star } from 'lucide-react';
import { PodcastGenerator } from '@/components/ui/podcastgen';

export default function Page() {
  return (
    <div className="flex h-screen text-white bg-[#0e1111]">
      <Sidebar/>
      <main className="flex-1 flex flex-col rounded-xl m-4 bg-white">
        <header className="flex justify-between items-center p-4 border-b border-white/10">
          <h1 className="text-2xl font-bold text-green-400">Audio Generation</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:text-green-400">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-green-400">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-green-400">
              <Share className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4">
          <PodcastGenerator />
        </div>
      </main>
    </div>
  );
}