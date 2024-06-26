from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from salesman_algorithm import solve  

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb+srv://inon:autoCAR12@autonomouscar.xxazafs.mongodb.net/autoCar')
db = client.autoCar
cars_collection = db.cars

class Point:
    def __init__(self, x, y) -> None:
        self.x = x
        self.y = y

@app.route('/optimize-route', methods=['POST'])
def optimize_route():
    try:
        coordinates = request.json.get('coordinates', [])
        if not coordinates:
            return jsonify({'error': 'No coordinates provided'}), 400

        points = [Point(coord['x'], coord['y']) for coord in coordinates]


        optimized_route = solve(points)

        return jsonify({'optimized_route': [vars(point) for point in optimized_route]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
