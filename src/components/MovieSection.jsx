import React from "react";
import { Container, Grid, Card, CardMedia, CardContent, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();
  const theme = useTheme(); // Detects dark mode or light mode

  return (
    <Container className="movie-section">
      <Typography 
        variant="h5" 
        sx={{ 
          marginBottom: 2, 
          fontWeight: "bold",
          color: theme.palette.mode === "dark" ? "#ffffff" : "#000000"
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={3}>
        {movies.slice(0, 4).map(movie => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card 
              onClick={() => navigate(`/recommendations/${movie.media_type || (movie.first_air_date ? 'tv' : 'movie')}/${movie.id}`)} 
              sx={{ 
                cursor: "pointer", 
                borderRadius: "12px", 
                boxShadow: theme.palette.mode === "dark" ? 5 : 3,
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": { 
                  transform: "scale(1.05)", 
                  boxShadow: theme.palette.mode === "dark" ? 8 : 6
                },
                backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#000000"
              }}
            >
              <CardMedia
                component="img"
                sx={{ 
                  width: "100%", 
                  height: 250, 
                  borderRadius: "12px 12px 0 0",
                  objectFit: "cover"
                }}
                image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image.jpg"}
                alt={movie.title || movie.name}
              />
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {movie.title || movie.name}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#b0b0b0" : "gray" }}>
                  {movie.release_date || movie.first_air_date}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    marginTop: 1, 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    display: "-webkit-box", 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: "vertical",
                    color: theme.palette.mode === "dark" ? "#cfcfcf" : "#4a4a4a"
                  }}
                >
                  {movie.overview || "No description available."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MovieSection;
