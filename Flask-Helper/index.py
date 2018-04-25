from flask import Flask, render_template
app = Flask(__name__)

@app.route('/hello')
def hello_world():
    return 'Hello, World!'

@app.route('/')
def home():
    return render_template('demo-static.html')