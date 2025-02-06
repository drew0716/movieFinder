import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Typography, Box } from "@mui/material";
import "../styles/movieFinder.scss";
import SearchBar from "./SearchBar";
import MovieSection from "./MovieSection";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("multi");
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const fetchUpcomingMovies = async (pageNum) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&region=US&sort_by=release_date.asc&release_date.gte=${today}&page=${pageNum}`);
      const data = await response.json();
      const filteredMovies = (data.results || []).filter(movie => new Date(movie.release_date) >= new Date());
      setUpcomingMovies((prevMovies) => [...prevMovies, ...filteredMovies]);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  };

  useEffect(() => {
    fetchUpcomingMovies(page);
  }, [page]);

  const lastMovieElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    []
  );

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
          <Box sx={{ width: "100%", maxWidth: "800px", mt: 4 }}>
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              searchCategory={searchCategory} 
              setSearchCategory={setSearchCategory}
            />
          </Box>
        </Box>
      </Box>

      {/* Upcoming Movies Section */}
      <Box className="movie-sections">
        <Typography variant="h5" className="section-title">📅 Upcoming Movies</Typography>
        <MovieSection title="Upcoming Movies" movies={upcomingMovies} lastMovieRef={lastMovieElementRef} layoutStyle="detailed" />
      </Box>
    </Container>
  );
};

export default MovieFinder;
