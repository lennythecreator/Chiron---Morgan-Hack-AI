import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
//"sk_70f0ff2a015d1fbf7e68aa81dfac65a80d2c1cbcaae83a68"
//process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_VOICE_ID = 'Yko7PKHZNXotIFUBG7I9';
const OPENAI_API_KEY =process.env.OPENAI_API_KEY;
//"sk-kpwL5LjA4ojG8TwNXKK7LfgAUNbiawmfBoD6njkmLFT3BlbkFJyJcYI-xd-FCUqaTsNHWsIFRpqK6RXkR1ezHFkHOKAA"
//process.env.OPENAI_API_KEY;

console.log('ELEVEN_LABS_API_KEY:', ELEVEN_LABS_API_KEY);
console.log('OPENAI_API_KEY:', OPENAI_API_KEY);

export async function generatePodcastScript(topic: string): Promise<string> {
  console.log('Making OpenAI API request for topic:', topic);
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4-turbo",
        messages: [{
          role: "system",
          content: "You are an expert podcast host chiron who creates engaging educational content. Your style is conversational, clear, and enthusiastic. eg script should be plain text nothing else like this: hello will will be talking about {topic}"
        }, {
          role: "user",
          content: `Create a single-paragraph 5-minute educational podcast about ${topic}. Include:
            1. An engaging introduction
            2. Clear explanation of key concepts
            3. Interesting facts and examples
            4. Real-world applications or implications
            5. A concise conclusion
            Keep the tone conversational and engaging, as if speaking directly to the listener.
            "`
        }],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('OpenAI API response received successfully');
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    throw error;
  }
}

export async function generatePodcast(text: string): Promise<Blob> {
  console.log('Making ElevenLabs API request with text length:', text.length);
  
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_LABS_VOICE_ID}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );

    console.log('ElevenLabs API response received successfully');
    return response.data;
  } catch (error) {
    console.error('Error in ElevenLabs API call:', error);
    throw error;
  }
}