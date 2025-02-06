import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardMedia, CardContent, Link, ToggleButton, ToggleButtonGroup, Badge } from "@mui/material";
import Masonry from "react-masonry-css";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/movieFinder.scss";
import BreadcrumbNav from "./BreadcrumbNav";
import CastList from "./CastList"; // ✅ Import the new CastList component

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const Recommendations = () => {
  const { media_type, id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${media_type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers`);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const [movieResponse, tvResponse] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US`)
        ]);
        
        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json()
        ]);
        
        const combinedResults = [
          ...(movieData.results || []).map(item => ({ ...item, media_type: "movie" })),
          ...(tvData.results || []).map(item => ({ ...item, media_type: "tv" }))
        ].filter(item => item.poster_path)
         .sort((a, b) => b.popularity - a.popularity);
        
        setRecommendations(combinedResults);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchMovieDetails();
    fetchRecommendations();
  }, [id, media_type]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredRecommendations = recommendations.filter(movie => 
    filter === "all" || movie.media_type === filter
  );

  return (
    <Container>
      <BreadcrumbNav movieTitle={movieDetails?.title || movieDetails?.name} />
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ marginTop: 2 }}>
        Back
      </Button>

      {movieDetails && (
        <>
          <Card className="movie-details-card" sx={{ display: 'flex', marginTop: 4, padding: 2 }}>
            {movieDetails.poster_path && (
              <CardMedia
                component="img"
                sx={{ width: 200, height: "auto", borderRadius: 2 }}
                image={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title || movieDetails.name}
              />
            )}
            <div style={{ paddingLeft: 20 }}>
              <Typography variant="h4">{movieDetails.title || movieDetails.name}</Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>{movieDetails.overview}</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}><strong>Release Date:</strong> {movieDetails.release_date || movieDetails.first_air_date}</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}><strong>Genres:</strong> {movieDetails.genres?.map(g => g.name).join(", ")}</Typography>
              {movieDetails.homepage && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  <Link href={movieDetails.homepage} target="_blank" rel="noopener">Official Website</Link>
                </Typography>
              )}
            </div>
          </Card>

          {/* ✅ New CastList Component */}
          <CastList mediaType={media_type} movieId={id} />
        </>
      )}

      <Typography variant="h4" sx={{ marginTop: 4 }}>Similar Titles</Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>Results Found: {filteredRecommendations.length}</Typography>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        aria-label="media filter"
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="all" aria-label="show all">All</ToggleButton>
        <ToggleButton value="movie" aria-label="show movies">Movies</ToggleButton>
        <ToggleButton value="tv" aria-label="show tv shows">TV Shows</ToggleButton>
      </ToggleButtonGroup>
      
      <Masonry
        breakpointCols={{ default: 6, 1200: 6, 900: 4, 600: 2, 400: 1 }}
        className="movie-masonry-grid"
        columnClassName="movie-masonry-column"
      >
        {filteredRecommendations.map((movie) => (
          <div key={movie.id} className="movie-masonry-item">
            <Badge badgeContent={Math.round(movie.popularity)} color="secondary">
              <Card onClick={() => navigate(`/recommendations/${movie.media_type}/${movie.id}`)} sx={{ cursor: "pointer" }}>
                <CardMedia
                  component="img"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title || movie.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {movie.release_date || movie.first_air_date} ({movie.media_type === "tv" ? "TV Show" : "Movie"})
                  </Typography>
                </CardContent>
              </Card>
            </Badge>
          </div>
        ))}
      </Masonry>
    </Container>
  );
};

export default Recommendations;
