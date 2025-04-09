from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def wordle():
    return render_template('wordle.html')  

if __name__ == '__main__':
    app.run(debug=True)