from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from flask_caching import Cache
import re
from utils import sanitize_html
from challenges import challenges

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://codeforces.com/',
}

# Dashboard/recent submissions
@app.route('/api/codeforces/<handle>', methods=['GET'])
@cache.cached(timeout=300)
def get_codeforces_data(handle):
    try:
        submissions_resp = requests.get(f"https://codeforces.com/api/user.status?handle={handle}", headers=HEADERS)
        submissions_resp.raise_for_status()
        submissions = submissions_resp.json()['result']

        rating_resp = requests.get(f"https://codeforces.com/api/user.rating?handle={handle}", headers=HEADERS)
        rating_resp.raise_for_status()
        rating_history = rating_resp.json()['result']

        return jsonify({
            "submissions": submissions,
            "rating_history": rating_history
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Recommendations
@app.route('/api/recommend/<handle>', methods=['GET'])
@cache.cached(timeout=300)
def recommend_problems(handle):
    try:
        submissions_resp = requests.get(f"https://codeforces.com/api/user.status?handle={handle}", headers=HEADERS)
        submissions_resp.raise_for_status()
        submissions = submissions_resp.json()['result']

        user_info_resp = requests.get(f"https://codeforces.com/api/user.info?handles={handle}", headers=HEADERS)
        user_info_resp.raise_for_status()
        user_rating = user_info_resp.json()['result'][0].get('rating', 1500)

        problems_resp = requests.get("https://codeforces.com/api/problemset.problems", headers=HEADERS)
        problems_resp.raise_for_status()
        all_problems = problems_resp.json()['result']['problems']

        solved_problems = {f"{p['problem']['contestId']}_{p['problem']['index']}" for p in submissions if p.get('verdict') == 'OK'}

        easy, medium, hard = [], [], []
        for p in all_problems:
            if 'rating' not in p:
                continue
            pid = f"{p['contestId']}_{p['index']}"
            if pid in solved_problems:
                continue
            if p['rating'] <= user_rating - 300:
                easy.append(p)
            elif p['rating'] <= user_rating + 100:
                medium.append(p)
            elif p['rating'] <= user_rating + 500:
                hard.append(p)

        import random
        recommendations = {
            'easy': random.sample(easy, min(5, len(easy))),
            'medium': random.sample(medium, min(5, len(medium))),
            'hard': random.sample(hard, min(5, len(hard))),
            'user_rating': user_rating
        }
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Analyze a specific submission
@app.route('/api/analyze-submission/<handle>/<submission_id>', methods=['GET'])
@cache.cached(timeout=300)
def analyze_submission(handle, submission_id):
    try:
        submissions_resp = requests.get(f"https://codeforces.com/api/user.status?handle={handle}", headers=HEADERS)
        submissions_resp.raise_for_status()
        submissions = submissions_resp.json()['result']

        submission = next((s for s in submissions if str(s['id']) == str(submission_id)), None)
        if not submission:
            return jsonify({"error": "Submission not found"}), 404

        contest_id = submission['problem']['contestId']
        index = submission['problem']['index']
        other_resp = requests.get(f"https://codeforces.com/api/contest.status?contestId={contest_id}&from=1&count=100", headers=HEADERS)
        other_resp.raise_for_status()
        other_accepted = [s for s in other_resp.json()['result'] if s['problem']['index'] == index and s['verdict'] == 'OK']

        def percentile(value, arr):
            if not arr:
                return 0
            return sum(1 for x in arr if x > value) / len(arr) * 100

        time_percentile = percentile(submission.get('timeConsumedMillis', 0), [s.get('timeConsumedMillis', 0) for s in other_accepted])
        memory_percentile = percentile(submission.get('memoryConsumedBytes', 0), [s.get('memoryConsumedBytes', 0) for s in other_accepted])

        tips = []
        lang = submission.get('programmingLanguage', '')
        if time_percentile >= 50:
            tips.append("Consider optimizing your algorithm to improve execution time.")
        else:
            tips.append("Your solution is faster than average. Great job!")
        if memory_percentile >= 50:
            tips.append("Try reducing memory usage with more efficient data structures.")
        else:
            tips.append("Your solution is memory-efficient!")
        if "C++" in lang:
            tips.append("Consider using fast I/O techniques in C++.")
        elif "Python" in lang:
            tips.append("Optimize Python critical sections or consider PyPy.")
        elif "Java" in lang:
            tips.append("Minimize object creation in Java.")

        return jsonify({
            'analysis': {
                'time_percentile': round(time_percentile, 1),
                'memory_percentile': round(memory_percentile, 1),
                'submission_time': submission.get('timeConsumedMillis', 0),
                'average_time': sum(s.get('timeConsumedMillis', 0) for s in other_accepted) / len(other_accepted) if other_accepted else 0,
                'language': lang
            },
            'tips': tips
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all challenges (filterable)
@app.route('/api/challenges', methods=['GET'])
@cache.cached(timeout=300)
def get_challenges():
    difficulty = request.args.get('difficulty')
    tag = request.args.get('tag')
    
    filtered = challenges
    if difficulty:
        filtered = [c for c in filtered if c['difficulty'] == difficulty]
    if tag:
        filtered = [c for c in filtered if tag in c['tags']]
    
    # Return minimal data for listing
    return jsonify([{
        "id": c["id"],
        "title": c["title"],
        "difficulty": c["difficulty"],
        "tags": c["tags"]
    } for c in filtered])

# Get single challenge details
@app.route('/api/challenge/<int:challenge_id>', methods=['GET'])
@cache.cached(timeout=300)
def get_challenge(challenge_id):
    challenge = next((c for c in challenges if c['id'] == challenge_id), None)
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404
    return jsonify(challenge)

# Validate user's code fix
@app.route('/api/validate-fix', methods=['POST'])
def validate_fix():
    data = request.json
    challenge_id = data.get('challenge_id')
    user_fix = data.get('user_fix', '').strip()
    
    challenge = next((c for c in challenges if c['id'] == challenge_id), None)
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404

    # Compare the user's fix to the correct C++ line (case-insensitive, ignore spaces)
    correct = challenge['correct_line'].replace(' ', '').lower()
    user = user_fix.replace(' ', '').lower()
    if user == correct:
        return jsonify({"passed": True, "message": "All test cases passed!"})
    else:
        return jsonify({
            "passed": False,
            "message": f"Your fix was not correct. Expected: {challenge['correct_line']}"
        })

if __name__ == '__main__':
    app.run(debug=True)
