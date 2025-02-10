import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
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
  const [randomBackdrop, setRandomBackdrop] = useState("");
  const observer = useRef();

  useEffect(() => {
    const fetchRandomBackdrop = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
          setRandomBackdrop(`https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`);
        }
      } catch (error) {
        console.error("Error fetching random backdrop:", error);
      }
    };
    fetchRandomBackdrop();
  }, []);

  const fetchUpcomingMovies = async (pageNum) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&region=US&sort_by=release_date.asc&primary_release_date.gte=${today}&page=${pageNum}`
      );
      const data = await response.json();
  
      if (!data.results || data.results.length === 0) {
        console.warn("No upcoming movies found.");
        return;
      }
  
      console.log("Fetched upcoming movies:", data.results);
  
      const filteredMovies = data.results
        .map((movie) => ({
          ...movie,
          overview: movie.overview ? movie.overview.split(" ").slice(0, 10).join(" ") + "..." : "No summary available.",
        }))
        .filter((movie) => movie.poster_path && movie.release_date);
  
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
      {/* Hero Section with Animated Background */}
      <Box className="hero-section" sx={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url(${randomBackdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "3rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        borderRadius: "20px",
        boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)",
        zIndex: 1
      }}>
        <Box sx={{ backdropFilter: "blur(10px)", background: "rgba(255, 255, 255, 0.1)", padding: "2rem", borderRadius: "20px", maxWidth: "800px", width: "100%", position: "relative", zIndex: 2, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Find Your Next Favorite Movie 🎬
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: "1.5rem" }}>
            Search for trending movies & TV shows and explore what’s coming soon!
          </Typography>
          <Card sx={{ padding: "1rem", borderRadius: "20px", background: "rgba(255, 255, 255, 0.85)", boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)", position: "relative", zIndex: 3 }}>
            <CardContent>
              <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                searchCategory={searchCategory} 
                setSearchCategory={setSearchCategory}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Upcoming Movies Section */}
      <Box className="movie-sections" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4, position: "relative", zIndex: 2, pointerEvents: "auto", width: "100%" }}>
        <MovieSection title="📅 Upcoming Movies" movies={upcomingMovies} lastMovieRef={lastMovieElementRef} layoutStyle="modern" />
      </Box>
    </Container>
  );
};

export default MovieFinder;
