import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';

export default function Navbar({
  mode,
  setMode,
}: {
  mode: "light" | "dark";
  setMode: (m: "light" | "dark") => void;
}) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
        >
          Codeforces Dashboard
        </Typography>
        <Button color="inherit" component={RouterLink} to="/recommendations">Recommendations</Button>
        <Button color="inherit" component={RouterLink} to="/submissions">Submissions</Button>
        <Button color="inherit" component={RouterLink} to="/analyze">Analyze</Button>
        <Button color="inherit" component={RouterLink} to="/challenges">Debugger</Button>

        <Box sx={{ ml: 2 }}>
          <IconButton
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="inherit"
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
