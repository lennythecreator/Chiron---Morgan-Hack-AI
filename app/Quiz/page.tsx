"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookHeadphones, Clapperboard, FileStack, FileVideo, MessageCircle, MessageCircleQuestion, Share, Star, Video } from 'lucide-react'

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Page() {
  const router = useRouter()
  const [quizPrompt, setQuizPrompt] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // This is a mock quiz. In a real application, you'd generate this based on the user's prompt.
  const quizQuestions: QuizQuestion[] = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2
    }
  ]

  const handleStartQuiz = () => {
    // In a real application, you'd generate the quiz based on quizPrompt here
    setQuizStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setIsCorrect(answerIndex === quizQuestions[currentQuestion].correctAnswer)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      // Quiz finished
      setQuizStarted(false)
      setCurrentQuestion(0)
    }
  }

  return (
    <div className="flex h-screen text-white bg-[#0e1111]">
      <Sidebar />
      <main className="flex-1 flex flex-col rounded-xl m-4 bg-white text-slate-700 p-4">
        <header className="flex justify-between items-center p-4 border-b border-gray-400">
          <h1 className="text-xl font-semibold">Quiz</h1>
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
          {!quizStarted ? (
            <Card>
              <CardHeader>
                <CardTitle>Generate a Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter a topic for your quiz"
                  value={quizPrompt}
                  onChange={(e) => setQuizPrompt(e.target.value)}
                  className="mb-4"
                />
                <Button onClick={handleStartQuiz} disabled={!quizPrompt}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{quizQuestions[currentQuestion].question}</CardTitle>
              </CardHeader>
              <CardContent>
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full mb-2 justify-start bg-gray-900 ${
                      selectedAnswer === index
                        ? isCorrect
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                        : ""
                    }`}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                ))}
                {selectedAnswer !== null && (
                  <Button onClick={handleNextQuestion} className="mt-4 bg-black">
                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}