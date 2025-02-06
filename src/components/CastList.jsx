import React, { useEffect, useState, useRef } from "react";
import { Container, Typography, Avatar, Card, CardContent, Modal, Box, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "../styles/castList.scss";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const CastList = ({ mediaType, movieId }) => {
  const [cast, setCast] = useState([]);
  const [selectedCast, setSelectedCast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maskEnabled, setMaskEnabled] = useState(true); // Controls fade effect
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${mediaType}/${movieId}/credits?api_key=${API_KEY}&language=en-US`);
        setCast(response.data.cast);
      } catch (error) {
        console.error("Error fetching cast details:", error);
      }
    };

    if (movieId) {
      fetchCast();
    }
  }, [mediaType, movieId]);

  // Fetch detailed person info when a cast member is clicked
  const fetchPersonDetails = async (personId) => {
    try {
      const response = await axios.get(`${BASE_URL}/person/${personId}?api_key=${API_KEY}&language=en-US`);
      setSelectedCast(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching person details:", error);
    }
  };

  // Drag scrolling function
  const handleMouseDown = (event) => {
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grabbing";
      let startX = event.pageX - scrollRef.current.offsetLeft;
      let scrollLeft = scrollRef.current.scrollLeft;

      const onMouseMove = (e) => {
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
      };

      const onMouseUp = () => {
        scrollRef.current.style.cursor = "grab";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  };

  // Update fade effect when scrolling
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft === 0 || scrollLeft + clientWidth >= scrollWidth) {
        setMaskEnabled(false);
      } else {
        setMaskEnabled(true);
      }
    }
  };

  return (
    <Container style={{ marginTop: "16px" }}>
      <Typography variant="h5" style={{ marginBottom: "16px" }}>Top Cast</Typography>

      {/* Horizontal Scrollable Cast List */}
      <div 
        className="cast-scroll-container"
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onScroll={handleScroll}
        style={{
          maskImage: maskEnabled
            ? "linear-gradient(90deg, transparent, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, transparent)"
            : "none",
          WebkitMaskImage: maskEnabled
            ? "linear-gradient(90deg, transparent, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 90%, transparent)"
            : "none",
        }}
      >
        {cast.length > 0 ? (
          cast.map((actor) => (
            <Card 
              key={actor.id} 
              className="cast-card" 
              onClick={() => fetchPersonDetails(actor.id)}
              tabIndex="0" // Makes it tabbable for accessibility
              role="button"
              aria-label={`View details for ${actor.name} as ${actor.character}`}
            >
              <Avatar
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/default-avatar.png"}
                className="cast-avatar"
              />
              <CardContent className="cast-content">
                <Typography variant="body1" className="cast-name"><strong>{actor.name}</strong></Typography>
                <Typography variant="body2" className="cast-role">{actor.character}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">No cast information available.</Typography>
        )}
      </div>

      {/* Modal for displaying detailed cast information */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box 
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75vw",
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
            outline: "none",
          }}
        >
          <IconButton onClick={() => setIsModalOpen(false)} sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}>
            <CloseIcon />
          </IconButton>

          {selectedCast && (
            <>
              <Typography variant="h4" gutterBottom>{selectedCast.name}</Typography>
              <Typography variant="body1">{selectedCast.biography || "No biography available."}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default CastList;
