from flask import Flask,jsonify, request
import requests
from flask_cors import CORS
from functions import create_transcript,add_embeddings, parse_data, search, feed_model, create_flashcards
app = Flask(__name__)
CORS(app)
@app.route('/')
def main():
    return jsonify(success=True)
@app.route('/chat', methods=['POST'])
def chat():
    args = request.get_json()
    prompt = args.get('prompt', '')
    history = args.get('history', [])
    style = args.get('style', '')
    index = args.get('index', '')
    if not (index and prompt):
        return {
            'body': {
                'success': False
            }
        }
    chunks = search(index, prompt, 10)
    response = feed_model(chunks, prompt, history, style)
    return jsonify(response)



@app.route('/vectorize', methods=['POST'])
def vectorize():
    args = request.get_json()
    res = requests.get(args.get('url', 'https://cosmos-bucket1.s3.us-east-2.amazonaws.com/chiron2.json'))
    data = res.text
    result = parse_data(data)
    add_embeddings('chiron2', result)
    return jsonify({
        'success': 'True'
    })


@app.route('/transcript', methods=['POST'])
def make_transcript():
    args = request.get_json()
    example = {'jobName': 'chiron2',
    'mediaFileUri': 's3://cosmos-bucket1/videoplayback.m4a',
    'outputBucketName': 'cosmos-bucket1'}
    res = create_transcript(example)
    return jsonify({
        'result': res,
        'success': 'True'
    })


@app.route('/flashcards')
def get_flashcards():
    style = request.args.get('style', 'important and serious')
    return jsonify(create_flashcards(style))
    

if __name__ == '__main__':
    app.run(debug=True)