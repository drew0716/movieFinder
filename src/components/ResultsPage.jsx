import React, { useState, useEffect } from "react";
import { Container, Typography, Dialog, DialogTitle, DialogContent, Button, CardMedia } from "@mui/material";
import Masonry from "react-masonry-css";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/movieFinder.scss";
import SearchBar from "./SearchBar";
import MovieGrid from "./MovieGrid";
import BreadcrumbNav from "./BreadcrumbNav";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || "";
  const searchType = queryParams.get("type") || "multi";
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/search/${searchType}?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&language=en-US`
        );
        const data = await response.json();
        setResults((data.results || []).filter(item => item.poster_path));
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchTerm, searchType]);

  useEffect(() => {
    if (!selectedMovie) return;

    const fetchSimilarMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${selectedMovie.id}/similar?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        setSimilarMovies((data.results || []).filter(movie => movie.poster_path));
      } catch (error) {
        console.error("Error fetching similar movies:", error);
      }
    };

    fetchSimilarMovies();
  }, [selectedMovie]);

  return (
    <Container>
      <BreadcrumbNav />
      
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        Search Results for "{searchTerm}" ({searchType === "multi" ? "All" : searchType === "movie" ? "Movies" : "TV Shows"})
      </Typography>

      <Masonry
        breakpointCols={{ default: 6, 1200: 6, 900: 4, 600: 2, 400: 1 }}
        className="movie-masonry-grid"
        columnClassName="movie-masonry-column"
      >
        {results.length > 0 ? (
          results.map((movie) => (
            <MovieGrid key={movie.id} results={[movie]} navigate={navigate} onMovieSelect={setSelectedMovie} />
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%", marginTop: 3 }}>
            No results found for "{searchTerm}".
          </Typography>
        )}
      </Masonry>

      {/* Hide Similar Titles Section if None Available */}
      {similarMovies.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Similar Titles
          </Typography>
          <Masonry
            breakpointCols={{ default: 6, 1200: 6, 900: 4, 600: 2, 400: 1 }}
            className="movie-masonry-grid"
            columnClassName="movie-masonry-column"
          >
            {similarMovies.map((movie) => (
              <MovieGrid key={movie.id} results={[movie]} navigate={navigate} />
            ))}
          </Masonry>
        </Box>
      )}
    </Container>
  );
};

export default ResultsPage;
