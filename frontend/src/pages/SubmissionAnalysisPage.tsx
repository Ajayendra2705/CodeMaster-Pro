import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, CircularProgress, Alert, Box, Stack,
  TextField, Button, Grid, Card, CardContent, LinearProgress, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { TipsAndUpdates, Code, Timer, Memory } from '@mui/icons-material';

type AnalysisData = {
  time_percentile: number;
  memory_percentile: number;
  submission_time: number;
  average_time: number;
  language: string;
};

type AnalysisResponse = {
  analysis: AnalysisData;
  tips: string[];
};

export default function SubmissionAnalysisPage() {
  const [handle, setHandle] = useState('tourist');
  const [inputHandle, setInputHandle] = useState('tourist');
  const [submissionId, setSubmissionId] = useState('');
  const [inputSubmissionId, setInputSubmissionId] = useState('');
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!handle || !submissionId) return;
    setLoading(true);
    setError('');
    setData(null);
    axios.get(`/api/analyze-submission/${handle}/${submissionId}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(
          err.response?.data?.error ||
          'Failed to analyze submission. Make sure the backend is running and the submission ID is valid.'
        );
        setLoading(false);
      });
  }, [handle, submissionId]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Submission Analysis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Enter your Codeforces handle and a submission ID to get performance insights and improvement tips.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" my={3}>
          <TextField
            label="Codeforces Handle"
            value={inputHandle}
            onChange={e => setInputHandle(e.target.value)}
            size="small"
          />
          <TextField
            label="Submission ID"
            value={inputSubmissionId}
            onChange={e => setInputSubmissionId(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={() => {
              setHandle(inputHandle.trim());
              setSubmissionId(inputSubmissionId.trim());
            }}
            disabled={loading || !inputHandle.trim() || !inputSubmissionId.trim()}
          >
            Analyze
          </Button>
        </Stack>

        {loading && <Box textAlign="center" py={4}><CircularProgress /></Box>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {data && !loading && (
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      Time Efficiency (better than {100 - Math.round(data.analysis.time_percentile)}% of submissions)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={100 - data.analysis.time_percentile}
                      color={data.analysis.time_percentile < 50 ? "success" : "warning"}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      Memory Usage (better than {100 - Math.round(data.analysis.memory_percentile)}% of submissions)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={100 - data.analysis.memory_percentile}
                      color={data.analysis.memory_percentile < 50 ? "success" : "warning"}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography>
                    Your Time: {data.analysis.submission_time}ms (Average: {Math.round(data.analysis.average_time)}ms)
                  </Typography>
                  <Typography>
                    Language: {data.analysis.language}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <TipsAndUpdates color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Improvement Tips
                  </Typography>
                  <List>
                    {data.tips.map((tip, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {index % 3 === 0 ? <Timer color="primary" /> :
                            index % 3 === 1 ? <Memory color="primary" /> :
                              <Code color="primary" />}
                        </ListItemIcon>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
