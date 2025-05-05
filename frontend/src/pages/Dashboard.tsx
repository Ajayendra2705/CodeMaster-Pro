import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, TextField, Button, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Box
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 50;

function formatDate(timestamp) {
  return format(new Date(timestamp * 1000), 'd MMM yyyy');
}

export default function Dashboard() {
  const [handle, setHandle] = useState('tourist');
  const [inputHandle, setInputHandle] = useState('tourist');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError('');
    setData(null);
    axios.get(`/api/codeforces/${handle}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data. Is the backend running?');
        setLoading(false);
      });
  }, [handle]);

  const chartData = data?.rating_history?.map(item => ({
    ...item,
    date: formatDate(item.ratingUpdateTimeSeconds),
    ratingChange: item.newRating - item.oldRating,
  })) ?? [];

  // Show latest contests first in the table
  const reversedData = [...chartData].reverse();
  const paginatedData = reversedData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const pageCount = Math.ceil(chartData.length / ITEMS_PER_PAGE);

  const currentRating = chartData.length ? chartData[chartData.length - 1].newRating : 'Unrated';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Codeforces Dashboard
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={3}>
          <TextField
            label="Codeforces Handle"
            value={inputHandle}
            onChange={e => setInputHandle(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={() => { setHandle(inputHandle.trim()); setPage(1); }}
            disabled={loading || !inputHandle.trim()}
          >
            Load
          </Button>
        </Stack>

        {loading && <Box textAlign="center" py={4}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}

        {data && !loading && !error && (
          <>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
              <Paper elevation={1} sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6">Current Rating</Typography>
                <Typography color="primary" fontWeight={700} fontSize={32}>
                  {currentRating}
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6">Contests</Typography>
                <Typography color="primary" fontWeight={700} fontSize={32}>
                  {chartData.length}
                </Typography>
              </Paper>
              <Paper elevation={1} sx={{ p: 2, flex: 1 }}>
                <Typography variant="h6">Submissions</Typography>
                <Typography color="primary" fontWeight={700} fontSize={32}>
                  {data.submissions?.length ?? 0}
                </Typography>
              </Paper>
            </Stack>

            <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" mb={2}>Rating History</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newRating" name="Rating" stroke="#1976d2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>Contest History</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Contest</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Rank</TableCell>
                      <TableCell align="right">Rating Change</TableCell>
                      <TableCell align="right">New Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedData.map(contest => (
                      <TableRow key={contest.contestId}>
                        <TableCell>
                          <a
                            href={`https://codeforces.com/contest/${contest.contestId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                          >
                            {contest.contestName}
                          </a>
                        </TableCell>
                        <TableCell>{contest.date}</TableCell>
                        <TableCell align="right">{contest.rank}</TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: contest.ratingChange > 0 ? 'green' : contest.ratingChange < 0 ? 'red' : undefined,
                            fontWeight: 500,
                          }}
                        >
                          {contest.ratingChange > 0 ? '+' : ''}
                          {contest.ratingChange}
                        </TableCell>
                        <TableCell align="right">{contest.newRating}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {pageCount > 1 && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                  <Typography variant="body2" color="text.secondary">
                    Showing {((page - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(page * ITEMS_PER_PAGE, chartData.length)} of {chartData.length} contests
                  </Typography>
                </Stack>
              )}
            </Paper>
          </>
        )}
      </Paper>
    </Container>
  );
}
