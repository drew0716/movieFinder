import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieGrid = ({ results }) => {
  const navigate = useNavigate();

  return (
    <> 
      {results.map((item) => (
        <div
          key={item.id}
          className="movie-masonry-item"
          tabIndex={0}
          role="button"
          onClick={() => navigate(`/recommendations/${item.media_type || (item.first_air_date ? 'tv' : 'movie')}/${item.id}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate(`/recommendations/${item.media_type || (item.first_air_date ? 'tv' : 'movie')}/${item.id}`);
            }
          }}
          style={{ cursor: "pointer" }}
        >
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
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
};

export default MovieGrid;
