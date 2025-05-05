import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, CircularProgress, Alert, Box, Chip,
  List, ListItem, ListItemText, Divider, Link, TextField, Button, Stack
} from '@mui/material';

type Problem = {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
};

type RecommendationData = {
  easy: Problem[];
  medium: Problem[];
  hard: Problem[];
  user_rating: number;
};

export default function RecommendationsPage() {
  const [handle, setHandle] = useState('tourist');
  const [inputHandle, setInputHandle] = useState('tourist');
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use the existing codeforces API until your backend endpoint is ready
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // First, fetch user info to get rating
        const userInfoResponse = await axios.get(`/api/codeforces/${handle}`);
        const userRating = userInfoResponse.data.rating_history.length > 0 
          ? userInfoResponse.data.rating_history[userInfoResponse.data.rating_history.length - 1].newRating 
          : 1500;
        
        // For now, generate sample recommendations since we don't have the actual endpoint
        // You'll replace this with your real API call when ready
        const mockRecommendations: RecommendationData = {
            easy: [
                { contestId: 1350, index: 'A', name: 'Orac and Factors', rating: userRating - 400, tags: ['math', 'implementation'] },
                { contestId: 1367, index: 'B', name: 'Even Array', rating: userRating - 300, tags: ['greedy', 'math'] },
                { contestId: 1374, index: 'C', name: 'Move Brackets', rating: userRating - 350, tags: ['greedy', 'strings'] },
                { contestId: 1385, index: 'B', name: 'Restore the Permutation by Merger', rating: userRating - 320, tags: ['greedy', 'implementation'] },
                { contestId: 1391, index: 'B', name: 'Fix You', rating: userRating - 380, tags: ['brute force', 'greedy', 'implementation'] }
              ],
              
              medium: [
                { contestId: 1354, index: 'B', name: 'Ternary String', rating: userRating, tags: ['binary search', 'dp'] },
                { contestId: 1358, index: 'C', name: 'Celex Update', rating: userRating + 50, tags: ['math'] },
                { contestId: 1370, index: 'C', name: 'Number Game', rating: userRating + 30, tags: ['games', 'math', 'number theory'] },
                { contestId: 1382, index: 'B', name: 'Sequential Nim', rating: userRating - 20, tags: ['dp', 'games'] },
                { contestId: 1388, index: 'C', name: 'Uncle Bogdan and Country Happiness', rating: userRating + 40, tags: ['dfs and similar', 'graphs', 'greedy', 'trees'] }
              ],
              
              hard: [
                { contestId: 1363, index: 'C', name: 'Game On Leaves', rating: userRating + 300, tags: ['games', 'trees'] },
                { contestId: 1365, index: 'D', name: 'Solve The Maze', rating: userRating + 400, tags: ['constructive algorithms', 'dfs and similar'] },
                { contestId: 1375, index: 'D', name: 'Replace by MEX', rating: userRating + 350, tags: ['brute force', 'constructive algorithms', 'sortings'] },
                { contestId: 1380, index: 'D', name: 'Berserk And Fireball', rating: userRating + 380, tags: ['constructive algorithms', 'greedy', 'implementation', 'math'] },
                { contestId: 1389, index: 'C', name: 'Good String', rating: userRating + 320, tags: ['brute force', 'dp', 'greedy', 'strings'] }
              ],
              
          user_rating: userRating
        };
        
        setData(mockRecommendations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch recommendations. Make sure the backend is running.');
        setLoading(false);
      }
    };

    fetchData();
  }, [handle]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Problem Recommendations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Personalized problem suggestions based on your rating and solved problems.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" my={3}>
          <TextField
            label="Codeforces Handle"
            value={inputHandle}
            onChange={e => setInputHandle(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={() => setHandle(inputHandle.trim())}
            disabled={loading || !inputHandle.trim()}
          >
            Get Recommendations
          </Button>
        </Stack>

        {loading && <Box textAlign="center" py={4}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}

        {data && !loading && (
          <Box mt={4}>
            <Typography variant="subtitle1" gutterBottom>
              User rating: <Chip label={data.user_rating} color="primary" />
            </Typography>

            {['easy', 'medium', 'hard'].map((difficulty) => (
              <Paper key={difficulty} elevation={1} sx={{ p: 3, mb: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  color: difficulty === 'easy' ? 'success.main' : 
                         difficulty === 'medium' ? 'warning.main' : 'error.main'
                }}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Problems
                </Typography>
                
                <List>
                  {data[difficulty as keyof RecommendationData]?.length > 0 ? (
                    data[difficulty as keyof RecommendationData].map((problem: Problem) => (
                      <React.Fragment key={`${problem.contestId}${problem.index}`}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Link 
                                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ textDecoration: 'none' }}
                              >
                                {problem.name}
                              </Link>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.primary">
                                  Rating: {problem.rating}
                                </Typography>
                                <Box mt={1}>
                                  {problem.tags.map(tag => (
                                    <Chip 
                                      key={tag} 
                                      label={tag} 
                                      size="small" 
                                      variant="outlined"
                                      sx={{ mr: 0.5, mb: 0.5 }}
                                    />
                                  ))}
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No recommended problems in this category" />
                    </ListItem>
                  )}
                </List>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}
