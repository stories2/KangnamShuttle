from flask import Flask, render_template
from Utils import CountManager
from Core import RequestManager
app = Flask(__name__)

@app.route('/hello')
def hello_world():
    return 'Hello, World!'

@app.route('/')
def home():
    upTime = CountManager.GetUpTime()
    return render_template('demo-static.html', days= upTime[0], hours= upTime[1], mins= upTime[2], sec= upTime[3])

@app.route('/kakao/kangnam/shuttle/staywarm/<enable>')
def stay_warm(enable):
    RequestManager.PreventColdStart(enable)
    return 'Your request accepted: ' + str(enable)