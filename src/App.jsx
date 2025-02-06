import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Switch, Container } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import MovieFinder from "./components/MovieFinder";
import ResultsPage from "./components/ResultsPage";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      {/* Global AppBar for navigation */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Movie Finder 🎬
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Toolbar>
      </AppBar>

      {/* Main Page Content */}
        <Container sx={{ marginTop: "80px", padding: 0 }}>
          <Routes>
            <Route path="/" element={<MovieFinder />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/recommendations/:media_type/:id" element={<Recommendations />} />
          </Routes>
        </Container>
    </div>
  );
};

export default App;
