import React, { useState, useEffect } from "react";
import { Container, Typography, Dialog, DialogTitle, DialogContent, Button, Card, CardMedia, Grid, Link } from "@mui/material";
import Masonry from "react-masonry-css";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/movieFinder.scss";
import SearchBar from "./SearchBar";
import MovieGrid from "./MovieGrid";
import BreadcrumbNav from "./BreadcrumbNav";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const Recommendations = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers`);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        setRecommendations((data.results || []).filter(movie => movie.poster_path));
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchMovieDetails();
    fetchRecommendations();
  }, [id]);

  return (
    <Container>
      <BreadcrumbNav movieTitle={movieDetails?.title} />
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ marginTop: 2 }}>
        Back
      </Button>

      {movieDetails && (
        <Card className="movie-details-card" sx={{ display: 'flex', marginTop: 4, padding: 2 }}>
          {movieDetails.poster_path && (
            <CardMedia
              component="img"
              sx={{ width: 200, height: "auto", borderRadius: 2 }}
              image={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
            />
          )}
          <div style={{ paddingLeft: 20 }}>
            <Typography variant="h4">{movieDetails.title}</Typography>
            <Typography variant="body1" sx={{ marginTop: 1 }}>{movieDetails.overview}</Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}><strong>Release Date:</strong> {movieDetails.release_date}</Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}><strong>Genres:</strong> {movieDetails.genres?.map(g => g.name).join(", ")}</Typography>
            {movieDetails.homepage && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                <Link href={movieDetails.homepage} target="_blank" rel="noopener">Official Website</Link>
              </Typography>
            )}
            {movieDetails["watch/providers"]?.results?.US?.flatrate && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                <strong>Where to Watch:</strong> {movieDetails["watch/providers"].results.US.flatrate.map(p => p.provider_name).join(", ")}
              </Typography>
            )}
          </div>
        </Card>
      )}

      <Typography variant="h4" sx={{ marginTop: 4 }}>Recommended Movies</Typography>
      <Masonry
        breakpointCols={{ default: 6, 1200: 6, 900: 4, 600: 2, 400: 1 }}
        className="movie-masonry-grid"
        columnClassName="movie-masonry-column"
      >
        {recommendations.map((movie) => (
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

export default Recommendations;
