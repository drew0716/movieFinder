import React, { useState, useEffect } from "react";
import { Container, Typography, Dialog, DialogTitle, DialogContent, Button, CardMedia } from "@mui/material";
import Masonry from "react-masonry-css";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/movieFinder.scss";
import SearchBar from "./SearchBar";
import MovieGrid from "./MovieGrid";
import BreadcrumbNav from "./BreadcrumbNav";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&language=en`
        );
        const data = await response.json();
        setResults((data.results || []).filter(movie => movie.poster_path));
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  return (
    <Container>
      <BreadcrumbNav />
      <SearchBar searchTerm={searchTerm} setSearchTerm={() => {}} handleSearch={(term) => navigate(`/results?query=${encodeURIComponent(term)}`)} />
      <Typography variant="h4" sx={{ marginBottom: 3, textAlign: "center" }}>
        Search Results for "{searchTerm}"
      </Typography>
      
      <Masonry
        breakpointCols={{ default: 6, 1200: 6, 900: 4, 600: 2, 400: 1 }}
        className="movie-masonry-grid"
        columnClassName="movie-masonry-column"
      >
        {results.map((movie) => (
          <MovieGrid key={movie.id} results={[movie]} navigate={navigate} onMovieSelect={setSelectedMovie} />
        ))}
      </Masonry>
      
      {/* Movie Details Modal */}
      <Dialog open={Boolean(selectedMovie)} onClose={() => setSelectedMovie(null)} fullWidth>
        {selectedMovie && (
          <>
            <DialogTitle>{selectedMovie.title || selectedMovie.name}</DialogTitle>
            <DialogContent>
              {selectedMovie.poster_path && (
                <CardMedia
                  component="img"
                  style={{ width: "100%", height: "auto" }}
                  image={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title || selectedMovie.name}
                />
              )}
              <Typography variant="body1" sx={{ marginTop: 2 }}>{selectedMovie.overview}</Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ marginTop: 2 }} 
                onClick={() => navigate(`/recommendations/${selectedMovie.id}`)}
              >
                View Similar
              </Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ResultsPage;
