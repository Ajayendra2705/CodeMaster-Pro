import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import RecommendationsPage from './pages/RecommendationsPage';
import RecentSubmissionsPage from './pages/RecentSubmissionsPage';
import SubmissionAnalysisPage from './pages/SubmissionAnalysisPage';

// Dummy pages for demonstration
function RatingsPage() { return <div>Ratings Page</div>; }
function ProblemsPage() { return <div>Problems Page</div>; }
function ContestsPage() { return <div>Contests Page</div>; }
function AboutPage() { return <div>About Page</div>; }

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#4a6fff" },
          secondary: { main: "#f50057" },
          background: {
            default: mode === "dark" ? "#181a1b" : "#f4f6fb",
            paper: mode === "dark" ? "#23272f" : "#fff",
          },
        },
        typography: {
          fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          {/* Navbar now receives mode and setMode for the brightness toggle */}
          <Navbar mode={mode} setMode={setMode} />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/submissions" element={<RecentSubmissionsPage />} />
              <Route path="/analyze" element={<SubmissionAnalysisPage />} />
              <Route path="/ratings" element={<RatingsPage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/contests" element={<ContestsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
