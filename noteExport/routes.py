from noteExport.Model import getUserInfo
from flask import Flask,render_template,request,jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("/home.html")

@app.route('/output', methods=['POST'])
def output():
    userName = request.form['userName']
    userInfo = getUserInfo.getUserInfo(userName)
    userInfo.setUserContentsUrl()

    noteContentsText = userInfo.getNoteContentsText()

    #アカウントが存在しない場合
    if type(noteContentsText).__name__ == "str":
        return jsonify({'text': 'アカウントが見つかりませんでした','list':[]})

    return jsonify({'text': noteContentsText.get("text"),'list':noteContentsText.get("list")})