"use client"
import React, { useState } from 'react'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookHeadphones, Clapperboard, FileStack, FileVideo, MessageCircle, MessageCircleQuestion, Share, Star, Video } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface Flashcard {
  question: string;
  answer: string;
}

export default function Page() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [prompt, setPrompt] = useState("")
  const [dataSource, setDataSource] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [flippedCards, setFlippedCards] = useState<boolean[]>([])

  const handleCreateFlashcards = () => {
    const newFlashcards: Flashcard[] = [
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
      { question: "What is the chemical symbol for gold?", answer: "Au" },
    ]
    setFlashcards(newFlashcards)
    setFlippedCards(new Array(newFlashcards.length).fill(false))
    setIsCreating(false)
  }

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const newFlipped = [...prev]
      newFlipped[index] = !newFlipped[index]
      return newFlipped
    })
  }

  return (
    <div className="flex h-screen text-white bg-[#0e1111]">
      <Sidebar />
      <main className="flex-1 flex flex-col rounded-xl m-4 bg-white text-slate-700">
        <header className="flex justify-between items-center p-4 border-b border-gray-400">
          <h1 className="text-xl font-semibold">Flashcards</h1>
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
          {!isCreating && flashcards.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsCreating(true)}>Create New Flashcards</Button>
              </CardContent>
            </Card>
          ) : isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle>Generate Flashcards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter a topic for your flashcards"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Select onValueChange={setDataSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wikipedia">Wikipedia</SelectItem>
                    <SelectItem value="textbook">Textbook</SelectItem>
                    <SelectItem value="custom">Custom Input</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateFlashcards} disabled={!prompt && !dataSource}>
                  Generate Flashcards
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {flashcards.map((flashcard, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="relative w-full" style={{ perspective: '1000px' }}>
                          <Card 
                            className="w-full h-64 cursor-pointer transition-all duration-700"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                            onClick={() => toggleFlip(index)}
                          >
                            <CardContent 
                              className="absolute inset-0 w-full h-full flex items-center justify-center p-4"
                              style={{ backfaceVisibility: 'hidden' }}
                            >
                              <p className="text-lg font-medium text-center">{flashcard.question}</p>
                            </CardContent>
                            <CardContent 
                              className="absolute inset-0 w-full h-full flex items-center justify-center p-4"
                              style={{ 
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                              }}
                            >
                              <p className="text-lg font-medium text-center">{flashcard.answer}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}