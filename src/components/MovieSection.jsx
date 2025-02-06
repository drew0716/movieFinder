import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const placeholderImage = "https://via.placeholder.com/120x180?text=No+Image";

const MovieSection = ({ title, movies, lastMovieRef, layoutStyle = "detailed" }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>{title}</Typography>
      <Box>
        {movies.map((movie, index) => {
          const isLastMovie = index === movies.length - 1;
          return (
            <Card
              key={movie.id}
              ref={isLastMovie ? lastMovieRef : null}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginBottom: 2,
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 }
              }}
              onClick={() => navigate(`/recommendations/movie/${movie.id}`)}
            >
              {/* Movie Poster */}
              <CardMedia
                component="img"
                sx={{ width: 120, height: "100%", objectFit: "cover" }}
                image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : placeholderImage}
                alt={movie.title}
              />

              {/* Movie Details */}
              <CardContent sx={{ flex: 1, padding: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{movie.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(movie.release_date).toDateString()}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {movie.overview || "No description available."}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </div>
  );
};

export default MovieSection;
