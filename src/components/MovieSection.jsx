import React from "react";
import { Container, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();

  return (
    <Container className="movie-section">
      <Typography variant="h5">{title}</Typography>
      <Grid container spacing={2}>
        {movies.slice(0, 4).map(movie => (
          <Grid item xs={12} sm={6} md={3} key={movie.id}>
            <Card 
              onClick={() => navigate(`/recommendations/${movie.media_type || (movie.first_air_date ? 'tv' : 'movie')}/${movie.id}`)} 
              sx={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                height="300"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
              />
              <CardContent>
                <Typography variant="h6">{movie.title || movie.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieSection;
