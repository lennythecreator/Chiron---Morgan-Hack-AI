
import concurrent.futures
import requests
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
import boto3
import time
pc = Pinecone(api_key='')
client = boto3.client(
    service_name='transcribe',
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name='us-east-2'
    )

s3 = boto3.client(
    service_name = 's3',
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name='us-east-2'
)

def create_transcript(data):
    client.start_transcription_job(
        TranscriptionJobName=data.get('jobName'),
        LanguageCode='en-US',
        Media={
            'MediaFileUri': data.get('mediaFileUri'),
        },
        OutputBucketName=data.get('outputBucketName'),
    )

    s3.put_object_acl(
        Bucket=data.get('outputBucketName'),
        Key=data.get('mediaFileUri').split('/')[-1],
        ACL='public-read'
    )
    
    return data['jobName']



def add_embeddings(index, parsed_data):
    # pc.create_index(name=index, dimension=1536, metric='euclidean', spec=ServerlessSpec(cloud='aws', region='us-east-1'))
    pc_index = pc.Index(index)
    sentence_texts, timestamps = parsed_data  # Unpack sentence_data
    print(timestamps, 'parsed')
    def process_sentence(sentence_text, timestamp):
        (start_time, end_time) = timestamp  # Unpack timestamp

        try:
            text_embeddings = get_embeddings(sentence_text)

            # Prepare the data for upserting
            index_data = {
                'id': f"{start_time}-{end_time}",
                "metadata": {                # Store additional info here
                    'sentence': sentence_text,
                    'timestamp': [str(start_time), str(end_time)],
                },
                'values': text_embeddings,
            }

            # Upsert the data into the index
            pc_index.upsert([index_data])
            return f"Success: {sentence_text}"

        except Exception as e:
            print(f'{e}')
            return f"Error processing '{sentence_text}': {e}"

    results = []
    for sentence_text,timestamp in zip(sentence_texts,timestamps):
        result = process_sentence(sentence_text, timestamp)
        results.append(result)

    return results


    



import json

def parse_data(data):
    data = json.loads(data)
    data = data['results']['items']
    sentences = []
    sentence = []
    timestamps = []
    
    sentence_start = None
    sentence_end = None

    for item in data:
        if item["type"] == "pronunciation":
            word = item["alternatives"][0]["content"]
            start_time = float(item["start_time"])
            end_time = float(item["end_time"])

            if sentence_start is None:
                sentence_start = start_time

            sentence.append(word)
            sentence_end = end_time

        elif item["type"] == "punctuation" and item["alternatives"][0]["content"] == ".":
            sentences.append(" ".join(sentence))
            timestamps.append((sentence_start, sentence_end))
            sentence = [] 
            sentence_start = None
            sentence_end = None

    if sentence:
        sentences.append(" ".join(sentence))
        timestamps.append((sentence_start, sentence_end))

    return sentences, timestamps




def get_embeddings(text):
    client = OpenAI(api_key='')
    
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding


def search(index,text, k):
    pc_index = pc.Index(index)

    query_embedding = get_embeddings(text)
    result = pc_index.query(
        top_k=k,
        vector=query_embedding,
        include_metadata=True 
    )
    print(result['matches'])
    return result['matches']

def feed_model(chunks, prompt, history, style):
    client = OpenAI(api_key='')
    history = ' '.join(history) if history else '' 
    text_chunks = ' '.join([chunk['metadata']['sentence'] for chunk in chunks])
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
    {"role": "system", "content": "you have context of this history, which will be passed into you, answer this or respond to this text with the style, which you will be giving, using this prompt you'll be giving, format it nice also"},
    {"role": "user", "content": f"text_chunks: {text_chunks}, prompt: {prompt}, style: {style}"}
  ]
)
    return {
        'content': completion.choices[0].message.content.strip('/n'),
        'isAI': True,
        'id': chunks[0]['metadata']['timestamp'],
        'time': chunks[0]['metadata']['timestamp'],
    }


def create_flashcards(style):
    client = OpenAI(api_key='')
    chunks = search('chiron2','flashcard important', 10)
    text_chunks = ' '.join([chunk['metadata']['sentence'] for chunk in chunks])
    completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
    {"role": "system", "content": "you have context of this, which will be passed into you,generate with the style, which you will be given, using this prompt you'll be giving, format it nice also, your task is to create 10  flash card on what the topic is and the most important things, feel free to go outside to look for more questions that are relevant to the topics and return your answer in json question: string, answer: string, let it just be list of those, just send it in a list, don't something i can just load up with json.loads(), take of the json at the top"},
    {"role": "user", "content": f"text_chunks: {text_chunks}, p, style: {style}"}
  ]
  )
    
    print(completion.choices[0].message.content.strip('\n'))
    print(json.loads(completion.choices[0].message.content.strip('\n')), 'json')
    return {
        'flashcards': json.loads(completion.choices[0].message.content.strip('\n'))
    }