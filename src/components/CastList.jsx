import React, { useEffect, useState, useRef } from "react";
import { Container, Typography, Avatar, Card, CardContent, Modal, Box, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "../styles/castList.scss";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const CastList = ({ mediaType, movieId }) => {
  const [cast, setCast] = useState([]);
  const [selectedCast, setSelectedCast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <Container sx={{ marginTop: "32px" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: "16px" }}>
        Top Cast
      </Typography>

      {/* Horizontal Scrollable Cast List */}
      <Box
        className="cast-scroll-container"
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "8px",
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#aaa", borderRadius: "4px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "#ddd" },
        }}
      >
        {cast.length > 0 ? (
          cast.map((actor) => (
            <Card
              key={actor.id}
              className="cast-card"
              onClick={() => fetchPersonDetails(actor.id)}
              tabIndex="0"
              role="button"
              aria-label={`View details for ${actor.name} as ${actor.character}`}
              sx={{
                minWidth: "160px", // ✅ Slightly larger width
                maxWidth: "180px",
                textAlign: "center",
                transition: "transform 0.2s ease-in-out",
                cursor: "pointer",
                borderRadius: "12px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                backgroundColor: "#fff",
                "&:hover": { transform: "scale(1.05)", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" },
              }}
            >
              <Avatar
                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : "/default-avatar.png"}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "12px 12px 0 0", // ✅ Image takes full width of the card
                }}
              />
              <CardContent sx={{ padding: "10px", textAlign: "center" }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    whiteSpace: "normal", // ✅ Allows wrapping for long names
                    wordBreak: "break-word",
                    fontSize: "14px",
                    lineHeight: "1.2",
                  }}
                >
                  {actor.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    whiteSpace: "normal", // ✅ Allows wrapping for character names
                    wordBreak: "break-word",
                    fontSize: "12px",
                  }}
                >
                  {actor.character}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">No cast information available.</Typography>
        )}
      </Box>

      {/* Modal for displaying detailed cast information */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: "75vw" },
            maxHeight: "85vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            outline: "none",
          }}
        >
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "gray",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedCast && (
            <Grid container spacing={3} alignItems="center">
              {/* Cast Member Image */}
              <Grid item xs={12} sm={4}>
                <Avatar
                  src={selectedCast.profile_path ? `https://image.tmdb.org/t/p/w300${selectedCast.profile_path}` : "/default-avatar.png"}
                  sx={{ width: "100%", height: "auto", borderRadius: "12px" }}
                />
              </Grid>

              {/* Cast Member Details */}
              <Grid item xs={12} sm={8}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {selectedCast.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Born:</strong> {selectedCast.birthday || "Unknown"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Place of Birth:</strong> {selectedCast.place_of_birth || "Unknown"}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  {selectedCast.biography || "No biography available."}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default CastList;
