from flask import Flask, request, jsonify
from puzzle_solution import astar, get_target, get_puzzle
from zpj_astar import astar_solve
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/getShuffled": {"origins": "http://localhost:3000"}, r"/getAnswer": {"origins": "http://localhost:3000"}})

@app.route("/getTarget")
def getPuzzle():
    dest = get_target(3, 3)
    return jsonify(dest)

@app.route("/getPuzzle")
def getShuffled():
    shuffled = get_puzzle(3, 3)
    return jsonify(shuffled)

@app.route('/getAnswer', methods=['GET', 'POST'])
def answer():
    puzzle = request.get_json().get("puzzle")
    print(puzzle)
    dest = get_target(len(puzzle), len(puzzle[0]))
    clicks = astar(puzzle, dest)[1]
    return jsonify(clicks)
        

if __name__ == '__main__':
    app.run(debug=True)