"use client"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, BookOpen, FileQuestion, Headphones, ChevronRight } from "lucide-react"

export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#0e1111] text-white font-[family-name:var(--font-geist-sans)]">
      <header className="container mx-auto py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-400">Chiron</h1>
          <Button variant="ghost" className="text-white hover:text-green-400">Get Started</Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">Learn Like a Hero with Chiron</h2>
          <p className="text-xl text-gray-300 mb-8">Inspired by the legendary centaur who trained Greek heroes, Chiron is your ultimate learning companion.</p>
          <Button size="lg" className="bg-green-400 hover:bg-green-500 text-white" onClick={() => router.push('/Dashboard')}>
            Start Your Journey
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<Video className="h-10 w-10 text-green-400" />}
            title="Chat with Video"
            description="Engage in video discussions to enhance your learning experience."
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-green-400" />}
            title="Create Flashcards"
            description="Craft personalized flashcards to reinforce your knowledge."
          />
          <FeatureCard
            icon={<FileQuestion className="h-10 w-10 text-green-400" />}
            title="Generate Quizzes"
            description="Test your understanding with auto-generated quizzes."
          />
          <FeatureCard
            icon={<Headphones className="h-10 w-10 text-green-400" />}
            title="Lecture Podcasts"
            description="Transform lecture transcripts into engaging podcasts."
          />
        </section>

        <section className="bg-white rounded-xl p-8 flex flex-col md:flex-row items-center text-slate-700">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h3 className="text-3xl font-bold text-green-600 mb-4">The Wisdom of Chiron</h3>
            <p className="text-lg mb-4">
              Just as Chiron, the wisest of centaurs, trained heroes like Achilles and Jason, our platform empowers you to become the hero of your learning journey.
            </p>
            <ul className="list-disc list-inside mb-6">
              <li>Personalized learning paths</li>
              <li>Interactive and engaging content</li>
              <li>Diverse learning methods for all styles</li>
              <li>Track your progress and growth</li>
            </ul>
            <Button 
              variant="outline" 
              size="lg"
              className="border-green-400 text-green-600 hover:bg-green-50"
            >
              Explore Features
            </Button>
          </div>
          <div className="md:w-1/2">
            <img
              src="\genai_m4_lla_odn_v3_upload_img_48772412_10_26_2024_06_46_23_152528_1158433480636273255.jpeg"
              alt="Illustration of learning journey"
              className="rounded-lg shadow-md"
              width={400}
              height={300}
            />
          </div>
        </section>
      </main>

      <footer className="bg-[#1a1a1a] text-gray-300 py-8 mt-16">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Chiron Learning. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}