import React from "react";
import { Dialog, DialogTitle, DialogContent, Button, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MovieDetailsModal = ({ selectedMovie, setSelectedMovie }) => {
  const navigate = useNavigate();

  if (!selectedMovie) return null;

  return (
    <Dialog open={Boolean(selectedMovie)} onClose={() => setSelectedMovie(null)} fullWidth>
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
    </Dialog>
  );
};

export default MovieDetailsModal;
