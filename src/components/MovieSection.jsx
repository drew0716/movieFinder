import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieSection = ({ title, movies, lastMovieRef, layoutStyle = "modern" }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold", color: "#444", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {movies.map((movie, index) => {
          const isLastMovie = index === movies.length - 1;
          return (
            <Card
              key={movie.id}
              ref={isLastMovie ? lastMovieRef : null}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                width: "100%",
                minHeight: "140px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                background: "#ffffff",
                transition: "0.3s",
                position: "relative",
                "&:hover": { boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)", transform: "scale(1.02)" },
              }}
              onClick={() => navigate(`/recommendations/movie/${movie.id}`)}
            >
              {/* Movie Poster */}
              <CardMedia
                component="img"
                sx={{ width: 120, height: "100%", objectFit: "cover", borderRadius: "10px 0 0 10px" }}
                image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/120x180?text=No+Image"}
                alt={movie.title}
              />

              {/* Movie Details */}
              <CardContent sx={{ flex: 1, padding: 2, display: "flex", flexDirection: "column", justifyContent: "center", color: "#333" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#222", marginBottom: "5px" }}>{movie.title}</Typography>
                <Typography variant="body2" color="#666" sx={{ marginBottom: "5px" }}>
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
    </Box>
  );
};

export default MovieSection;
