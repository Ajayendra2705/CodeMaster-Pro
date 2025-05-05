import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, CircularProgress, Alert, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Link, TextField, Button, Stack
} from '@mui/material';
import { format } from 'date-fns';

type Submission = {
  id: number;
  creationTimeSeconds: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
    tags?: string[];
  };
  programmingLanguage: string;
  verdict: string;
};

export default function RecentSubmissionsPage() {
  const [handle, setHandle] = useState('tourist');
  const [inputHandle, setInputHandle] = useState('tourist');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`/api/codeforces/${handle}`)
      .then(res => {
        setSubmissions(res.data.submissions.slice(0, 50)); // Show latest 20
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch submissions.');
        setLoading(false);
      });
  }, [handle]);

  const verdictColor = (verdict: string) => {
    if (verdict === 'OK') return 'success';
    if (verdict && verdict.startsWith('WRONG')) return 'error';
    if (verdict && verdict.startsWith('TIME')) return 'warning';
    if (verdict && verdict.startsWith('MEMORY')) return 'warning';
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Recent Submissions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Your latest Codeforces submissions (last 50 shown)
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
            Load Submissions
          </Button>
        </Stack>

        {loading && <Box textAlign="center" py={4}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && submissions.length > 0 && (
            <TableContainer>
                <Table size="small">
                    <TableHead>
                    <TableRow>
                        <TableCell>Problem</TableCell>
                        <TableCell>Tags</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Verdict</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Language</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {submissions.map(sub => (
                        <TableRow key={sub.id}>
                        <TableCell>
                            <Link
                            href={`https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ textDecoration: 'none' }}
                            >
                            {sub.problem.name}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {sub.problem.tags?.map(tag => (
                            <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                        </TableCell>
                        <TableCell>
                            {sub.problem.rating ? (
                            <Chip label={sub.problem.rating} size="small" color="primary" />
                            ) : "-"}
                        </TableCell>
                        <TableCell>
                            <Chip
                            label={sub.verdict === 'OK' ? 'Accepted' : sub.verdict.replace(/_/g, ' ')}
                            color={
                                sub.verdict === 'OK'
                                ? 'success'
                                : sub.verdict.startsWith('WRONG')
                                ? 'error'
                                : sub.verdict.startsWith('TIME') || sub.verdict.startsWith('MEMORY')
                                ? 'warning'
                                : 'default'
                            }
                            size="small"
                            />
                        </TableCell>
                        <TableCell>
                            {format(new Date(sub.creationTimeSeconds * 1000), 'd MMM yyyy, HH:mm')}
                        </TableCell>
                        <TableCell>
                            {sub.programmingLanguage}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

        )}

        {!loading && !error && submissions.length === 0 && (
          <Typography>No submissions found.</Typography>
        )}
      </Paper>
    </Container>
  );
}
