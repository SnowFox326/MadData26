from flask import Flask, request, jsonify
from flask_cors import CORS
import SchedulerRater as sr
import base64

app = Flask(__name__)
CORS(app)

@app.route('/score', methods=['POST'])
def score():
    data = request.get_json() or {}
    codes = data.get('codes', [])
    credits = data.get('credits', [])
    try:
        # Delegate to existing calculate_score in SchedulerRater.py
        result = sr.calculate_score(codes, credits)
        return jsonify({'score': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/graphs', methods=['POST'])
def graphs():
    data = request.get_json() or {}
    codes = data.get('codes', [])
    result = []
    try:
        for code in codes:
            data = sr.get_grade_data(code)
            if not data:
                result.append({'code': code, 'error': 'no data'})
                continue
            grades_url = data.get('gradesUrl')
            if not grades_url:
                result.append({'code': code, 'error': 'no grades url'})
                continue
            grades_response = sr.requests.get(grades_url, headers=sr.headers).json()
            img_bytes = sr.create_graph(grades_response.get('cumulative', {}))
            b64 = base64.b64encode(img_bytes).decode('ascii')
            result.append({'code': code, 'image': f'data:image/png;base64,{b64}'})
        return jsonify({'graphs': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
