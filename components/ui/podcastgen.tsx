import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Mic, FileAudio, Sparkles, Wand2 } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { generatePodcast, generatePodcastScript } from '@/lib/podgen';

const TOPIC_SUGGESTIONS = [
  "The History of Ancient Rome",
  "How to use AWS services",
  "Introduction to Quantum Physics",
  "Understanding Climate Change",
  "The Basics of Financial Markets",
  "World War II: Key Events",
  "The Human Brain and Consciousness",
  "Artificial Intelligence Fundamentals",
  "The Solar System and Beyond"
];

export function PodcastGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'writing' | 'recording' | 'done'>('writing');

  const handleGenerate = async () => {
    try {
      console.log('Starting podcast generation for topic:', prompt);
      setIsGenerating(true);
      setError(null);
      setStep('writing');

      // Generate podcast script using OpenAI
      console.log('Generating script with OpenAI...');
      const podcastScript = await generatePodcastScript(prompt);
      console.log('Script generated successfully:', podcastScript.substring(0, 100) + '...');
      setScript(podcastScript);
      setStep('recording');

      // Convert script to audio using ElevenLabs
      console.log('Converting script to audio with ElevenLabs...');
      const audioBlob = await generatePodcast(podcastScript);
      console.log('Audio generated successfully, creating URL...');
      const url = URL.createObjectURL(audioBlob);
      console.log('Audio URL created:', url);
      setAudioUrl(url);
      setStep('done');
      console.log('Podcast generation completed');
    } catch (err) {
      console.error('Error generating podcast:', err);
      setError('Failed to generate podcast. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusMessage = () => {
    if (isGenerating) {
      switch (step) {
        case 'writing':
          return 'Writing your podcast script...';
        case 'recording':
          return 'Converting script to audio...';
        default:
          return 'Generating podcast...';
      }
    }
    return 'Generate Educational Podcast';
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card className="p-6 bg-[#1a1a1a] border-gray-700">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-green-400 mb-4">
            <Mic className="h-6 w-6" />
            <h2 className="text-xl font-semibold text-white">Create AI-Powered Educational Podcast</h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">What would you like to learn about?</label>
            <Input
              placeholder="Enter a topic (e.g., 'The History of Ancient Rome')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span>Suggested Topics</span>
              </div>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_SUGGESTIONS.map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(topic)}
                  className="bg-[#2a2a2a] border-gray-700 text-white hover:bg-[#3a3a3a]"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {getStatusMessage()}
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                {getStatusMessage()}
              </>
            )}
          </Button>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>
      </Card>

      {script && (
        <Card className="p-6 bg-[#1a1a1a] border-gray-700">
          <div className="flex items-center gap-4 text-green-400 mb-6">
            <FileAudio className="h-6 w-6" />
            <h3 className="text-xl font-semibold text-white">Generated Script</h3>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap">{script}</p>
          </div>
        </Card>
      )}

      {audioUrl && (
        <Card className="p-6 bg-[#1a1a1a] border-gray-700">
          <div className="flex items-center gap-4 text-green-400 mb-6">
            <FileAudio className="h-6 w-6" />
            <h3 className="text-xl font-semibold text-white">Your Educational Podcast</h3>
          </div>
          <AudioPlayer audioUrl={audioUrl} />
        </Card>
      )}
    </div>
  );
}