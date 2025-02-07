import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieSection = ({ title, movies, lastMovieRef, layoutStyle = "modern" }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold", color: "#444", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</Typography>
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
                alignItems: "flex-start",
                width: "100%",
                minHeight: "140px",
                marginBottom: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                background: "#f9f9f9",
                transition: "0.3s",
                "&:hover": { boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)", transform: "scale(1.02)" }
              }}
              onClick={() => navigate(`/recommendations/movie/${movie.id}`)}
            >
              {/* Gradient Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Movie Poster */}
              <CardMedia
                component="img"
                sx={{ width: 90, height: "100%", objectFit: "cover", borderRadius: "3px 0 0 3px" }}
                image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/100x150?text=No+Image"}
                alt={movie.title}
              />

              {/* Movie Details */}
              <CardContent sx={{ flex: 1, padding: 2, display: "flex", flexDirection: "column", justifyContent: "flex-start", color: "#333", position: "relative" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#222" }}>{movie.title}</Typography>
                <Typography variant="body2" color="#666" sx={{ marginBottom: 1 }}>
                  {new Date(movie.release_date).toDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {movie.overview || "No summary available."}
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
