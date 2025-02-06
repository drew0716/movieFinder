import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";

const MovieGrid = ({ results, onMovieSelect }) => {
  return (
    <>
      {results.map((item) => (
        <div key={item.id} className="movie-masonry-item" onClick={() => onMovieSelect(item)}>
          <Card className="movie-card">
            {item.poster_path && (
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
              />
            )}
            <CardContent>
              <Typography variant="h6">{item.title || item.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {item.release_date || item.first_air_date}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: "italic", color: "gray" }}>
                {item.media_type === "movie" ? "Movie" : item.media_type === "tv" ? "TV Show" : ""}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
};

export default MovieGrid;
