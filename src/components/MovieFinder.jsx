import React, { useState, useEffect } from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/movieFinder.scss";
import SearchBar from "./SearchBar";
import MovieSection from "./MovieSection";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieFinder = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("multi");
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentReleases, setRecentReleases] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularRes, recentRes, topRatedRes] = await Promise.all([
          fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`),
          fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`)
        ]);
        const [popularData, recentData, topRatedData] = await Promise.all([
          popularRes.json(),
          recentRes.json(),
          topRatedRes.json()
        ]);
        setPopularMovies((popularData.results || []).filter(movie => movie.poster_path));
        setRecentReleases((recentData.results || []).filter(movie => movie.poster_path));
        setTopRated((topRatedData.results || []).filter(movie => movie.poster_path));
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovies();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/results?query=${encodeURIComponent(searchTerm)}&type=${searchCategory}`);
  };

  return (
    <Container>
      {/* Hero Section with Animated CSS Background */}
      <Box className="hero-section">
        <Box className="hero-overlay">
          <Typography variant="h3" className="hero-title">
            Welcome to MovieFinder 🎬
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            Explore trending movies & TV shows. Search and discover your next favorite watch.
          </Typography>

          {/* Search Box Section */}
          <Box sx={{ width: "100%", maxWidth: "800px", mt: 4 }}>
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              handleSearch={handleSearch} 
              searchCategory={searchCategory} 
              setSearchCategory={setSearchCategory}
            />
          </Box>
        </Box>
      </Box>

      {/* Movie Sections */}
      <Box className="movie-sections">
        <Typography variant="h5" className="section-title">
          🔥 Popular, Recent, and Top Rated
        </Typography>

        <MovieSection title="🎥 Popular Movies" movies={popularMovies} />
        <MovieSection title="📅 Recent Releases" movies={recentReleases} />
        <MovieSection title="⭐ Top Rated Movies" movies={topRated} />
      </Box>
    </Container>
  );
};

export default MovieFinder;
