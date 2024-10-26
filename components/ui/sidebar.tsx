import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Search, Settings, Plus, Music, Notebook, Home } from 'lucide-react'

export function Sidebar() {
  const router = useRouter()

  const menuItems = [
    { icon: Home, label: 'Dashboard', route: '/Dashboard' },
    { icon: MessageSquare, label: 'Chats', route: '/Chat' },
    { icon: Search, label: 'Search', route: '/search' },
    { icon: Music, label: 'Podcasts', route: '/podcasts' },
    { icon: Notebook, label: 'Flash Cards', route: '/Flashcards' },
    { icon: Settings, label: 'Settings', route: '/settings' },
  ]

  const chatItems = [
    { label: 'Welcome', count: 4 },
  ]

  return (
    <div className="w-64 bg-[#0e1111] flex flex-col">
      <div className="p-4 flex items-center space-x-2">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="font-semibold text-lg">Chiron</span>
      </div>
      <nav className="flex-1">
        <ul className="px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push(item.route)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <ScrollArea className="flex-1">
        <div className="px-2">
          {chatItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between mb-1"
              onClick={() => router.push(`/chats/${item.label}`)}
            >
              <span>{item.label}</span>
              {item.count > 0 && (
                <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">{item.count}</span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button
          className="w-full"
          onClick={() => router.push('/chats/new')}
        >
          <Plus className="mr-2 h-4 w-4" /> New chat
        </Button>
      </div>
    </div>
  )
}
