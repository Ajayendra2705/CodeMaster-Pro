import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Grid, Chip, FormControl,
  InputLabel, Select, MenuItem, Slider, Pagination, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, FormGroup, FormControlLabel, LinearProgress, Alert, Box, TableSortLabel, Stack, Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';

type Problem = {
  contestId: number;
  index: string;
  name: string;
  rating?: number;
  tags: string[];
  solvedCount?: number;
};

const SORTABLE_COLUMNS = [
  { id: 'contestId', label: 'Contest ID' },
  { id: 'index', label: 'Index' },
  { id: 'name', label: 'Name' },
  { id: 'rating', label: 'Rating' },
  { id: 'solvedCount', label: 'Solved By' }
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<number[]>([0, 3500]);
  const [sortBy, setSortBy] = useState('solvedCount');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 200,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchTags(); }, []);
  useEffect(() => { fetchProblems(); /* eslint-disable-next-line */ }, [pagination.page, selectedTags, ratingRange, sortBy, order]);

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/problem-tags');
      setTags(response.data);
    } catch { setTags([]); }
  };

  const fetchProblems = async () => {
    setLoading(true); setError(null);
    try {
      const params: any = {
        page: pagination.page,
        per_page: pagination.per_page,
        min_rating: ratingRange[0],
        max_rating: ratingRange[1],
        sort_by: sortBy,
        order: order,
      };
      if (selectedTags.length > 0) params.tags = selectedTags;
      const response = await axios.get('/api/problems', { params });
      setProblems(response.data.problems);
      setPagination(prev => ({ ...prev, total: response.data.total }));
    } catch {
      setError('Failed to fetch problems. Please try again later.');
    } finally { setLoading(false); }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleRatingChange = (_: Event, newValue: number | number[]) => {
    setRatingRange(newValue as number[]);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(column); setOrder('desc'); }
    setPagination(p => ({ ...p, page: 1 }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Codeforces Problems Browser
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {SORTABLE_COLUMNS.map(col => (
                  <MenuItem key={col.id} value={col.id}>{col.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select value={order} onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Rating Range</Typography>
            <Slider
              value={ratingRange}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={3500}
              step={100}
              sx={{ width: { xs: '100%', md: 250 }, ml: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Tags</Typography>
            <Box sx={{ maxHeight: 110, overflowY: 'auto', border: '1px solid #eee', borderRadius: 2, p: 1 }}>
              <FormGroup row>
                {tags.map(tag => (
                  <FormControlLabel
                    key={tag}
                    control={
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        size="small"
                      />
                    }
                    label={<Chip label={tag} size="small" sx={{ bgcolor: selectedTags.includes(tag) ? 'primary.light' : undefined }} />}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </FormGroup>
            </Box>
          </Grid>
        </Grid>

        {loading && <LinearProgress sx={{ my: 2 }} />}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {!loading && problems.length === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>No problems found matching your criteria.</Alert>
        )}

        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {SORTABLE_COLUMNS.map(col => (
                  <TableCell
                    key={col.id}
                    align={col.id === 'rating' || col.id === 'solvedCount' ? 'right' : 'left'}
                    sx={{ bgcolor: sortBy === col.id ? 'primary.lighter' : undefined, fontWeight: 600 }}
                  >
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? order : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map(problem => (
                <TableRow key={`${problem.contestId}-${problem.index}`} hover>
                  <TableCell>
                    <Tooltip title="View problem" arrow>
                      <Link
                        to={`/problem/${problem.contestId}/${problem.index}`}
                        style={{
                          textDecoration: 'none',
                          color: '#3f51b5',
                          fontWeight: 600,
                          transition: 'color 0.2s',
                          display: 'inline-block'
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = '#f50057')}
                        onMouseOut={e => (e.currentTarget.style.color = '#3f51b5')}
                      >
                        {problem.contestId}{problem.index}. {problem.name}
                      </Link>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{problem.index}</TableCell>
                  <TableCell align="left">{problem.name}</TableCell>
                  <TableCell align="right">{problem.rating || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <PeopleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography fontWeight={500}>
                        {problem.solvedCount !== undefined
                          ? problem.solvedCount.toLocaleString()
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {problem.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: selectedTags.includes(tag) ? 'primary.light' : 'grey.200',
                            color: selectedTags.includes(tag) ? 'primary.contrastText' : undefined
                          }}
                        />
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={Math.ceil(pagination.total / pagination.per_page)}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>
    </Container>
  );
}
