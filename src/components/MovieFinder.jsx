import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/movieFinder.scss";
import SearchBar from "./SearchBar";
import MovieSection from "./MovieSection";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MovieFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
    navigate(`/results?query=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Container>
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSearch={handleSearch} 
      />
      
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        Welcome to MovieFinder
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 5, textAlign: "center" }}>
        Search for movies, TV shows, and actors. Browse popular, recent, and top-rated movies below.
      </Typography>
      
      <Container className="movie-section">
        <MovieSection title="Popular Movies" movies={popularMovies} />
        <MovieSection title="Recent Releases" movies={recentReleases} />
        <MovieSection title="Top Rated Movies" movies={topRated} />
      </Container>
    </Container>
  );
};

export default MovieFinder;
