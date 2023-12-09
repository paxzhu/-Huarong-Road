from flask import Flask, request, jsonify
from puzzle_solution import astar, create_dest, shuffle
from zpj_astar import astar_solve
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/getShuffled": {"origins": "http://localhost:3000"}, r"/getReference": {"origins": "http://localhost:3000"}})

@app.route("/getDest")
def getPuzzle():
    dest = create_dest(3, 3)
    return jsonify(dest)

@app.route("/getShuffled")
def getShuffled():
    shuffled = shuffle(3, 3)
    return jsonify(shuffled)

@app.route('/getReference', methods=['GET', 'POST'])
def reference():
    puzzle = request.get_json().get("puzzle")
    dest = create_dest(len(puzzle), len(puzzle[0]))
    print(puzzle)
    print()
    print(dest)
    print("going to...")
    # clicks = astar(puzzle, dest)[1]
    clicks = [3, 1, 2]
    return jsonify(clicks)

if __name__ == '__main__':
    app.run(debug=True)