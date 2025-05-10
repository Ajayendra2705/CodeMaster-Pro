import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ChallengeAttemptPage.css';

const ChallengeAttemptPage = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<any>(null);
  const [userFix, setUserFix] = useState('');
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`/api/challenge/${id}`);
        setChallenge(res.data);
      } catch (error) {
        navigate('/challenges');
      }
    };
    fetchChallenge();
  }, [id, navigate]);

  useEffect(() => {
    if (result?.passed) {
      const solved = JSON.parse(localStorage.getItem('solvedChallenges') || '[]');
      if (!solved.includes(challenge.id)) {
        localStorage.setItem('solvedChallenges', JSON.stringify([...solved, challenge.id]));
      }
    }
  }, [result, challenge?.id]);

  if (!challenge) return <div>Loading...</div>;

  return (
    <div className="challenge-attempt-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="challenge-meta">
        <span className={`difficulty-badge ${challenge.difficulty}`}>
          {challenge.difficulty}
        </span>
      </div>

      <h1 className="challenge-title">{challenge.title}</h1>
      <div className="challenge-problem">{challenge.problem}</div>

      <pre className="code-block">
        {challenge.buggy_code}
      </pre>

      <input
        type="text"
        className="fix-input"
        placeholder="Enter your fix here..."
        value={userFix}
        onChange={e => setUserFix(e.target.value)}
      />

      <button
        className="submit-btn"
        onClick={async () => {
          try {
            const res = await axios.post('/api/validate-fix', {
              challenge_id: challenge.id,
              user_fix: userFix
            });
            setResult(res.data);
          } catch (error) {
            setResult({ passed: false, message: "Error validating your fix." });
          }
        }}
      >
        Submit Fix
      </button>

      {result && (
        <div className={`result ${result.passed ? 'success' : 'fail'}`}>
          {result.passed ? '✅ All tests passed!' : '❌ ' + (result.message || 'Some tests failed.')}
        </div>
      )}
    </div>
  );
};

export default ChallengeAttemptPage;
