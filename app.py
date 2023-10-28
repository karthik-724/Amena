from flask import Flask, request, render_template, jsonify
import google.generativeai as palm

palm.configure(api_key="AIzaSyDn3dhYLDgBq5rfafdEJ0Y4cCVPjghEqj0")

def generate_response(prompt):
    response = palm.generate_text(model="models/text-bison-001", prompt=prompt)
    return response.result 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    user_message = request.form['user_message']
    response = generate_response(user_message)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
