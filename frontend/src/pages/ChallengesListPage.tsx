import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ChallengesListPage.css';

type Challenge = {
  id: number;
  title: string;
  difficulty: string;
  tags: string[];
};

const ChallengesListPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [difficulty, setDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [solved, setSolved] = useState<number[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const params = new URLSearchParams();
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      if (selectedTags.length > 0) params.append('tag', selectedTags.join(','));
      
      const res = await axios.get(`/api/challenges?${params}`);
      setChallenges(res.data);
      
      // Collect all unique tags
      const tags = new Set<string>();
      res.data.forEach((c: Challenge) => c.tags.forEach((t: string) => tags.add(t)));
      setAllTags(Array.from(tags));
    };
    fetchChallenges();
    setSolved(JSON.parse(localStorage.getItem('solvedChallenges') || '[]'));
  }, [difficulty, selectedTags]);

  return (
    <div className="challenge-list-container">
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24 }}>Edge Case Challenges</h1>
      
      {/* Filters */}
      <div className="filter-bar">
        <select 
          value={difficulty} 
          onChange={e => setDifficulty(e.target.value)}
          className="difficulty-filter"
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        
        <div className="tag-filter-container">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-tag${selectedTags.includes(tag) ? " selected" : ""}`}
              onClick={() => setSelectedTags(prev =>
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="challenges-grid">
        {challenges.map(challenge => (
          <div className="challenge-card" key={challenge.id}>
            <div className="challenge-header">
              <span className={`difficulty-badge ${challenge.difficulty}`}>
                {challenge.difficulty}
              </span>
              {solved.includes(challenge.id) && (
                <span className="solved-badge">Solved</span>
              )}
            </div>
            <h3 className="challenge-title">{challenge.title}</h3>
            <div className="challenge-tags">
              {challenge.tags.map(tag => (
                <span key={tag} className="challenge-tag">{tag}</span>
              ))}
            </div>
            <Link to={`/challenge/${challenge.id}`} className="attempt-btn">
              Attempt Challenge
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesListPage;
