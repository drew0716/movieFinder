import React from "react";
import { Dialog, DialogTitle, DialogContent, Container, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const MovieSection = ({ title, movies }) => {
  return (
    <Container className="movie-section">
      <Typography variant="h5">{title}</Typography>
      <Grid container spacing={2}>
        {movies.slice(0, 4).map(movie => (
          <Grid item xs={12} sm={6} md={3} key={movie.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieSection;
