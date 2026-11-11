
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/youngest-game/")
def youngest_game():
    return render_template("youngest-game/play.html")


@app.route("/youngest-game/lesson/")
def youngest_lesson():
    return render_template("youngest-game/lesson.html")


@app.route("/middle-game/")
def middle_game():
    return render_template("middle-game/play.html")


if __name__ == "__main__":
    app.run(debug=True)
