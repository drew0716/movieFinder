import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardMedia, Box, IconButton, Grid } from "@mui/material";
import Masonry from "react-masonry-css";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/movieFinder.scss";
import BreadcrumbNav from "./BreadcrumbNav";
import CastList from "./CastList";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Map streaming platforms to their correct URLs
const STREAMING_PLATFORMS = {
  "Netflix": "https://www.netflix.com/",
  "Hulu": "https://www.hulu.com/",
  "Disney+": "https://www.disneyplus.com/",
  "HBO Max": "https://www.hbomax.com/",
  "Amazon Prime Video": "https://www.amazon.com/Amazon-Video/",
  "Apple TV+": "https://tv.apple.com/",
  "Peacock": "https://www.peacocktv.com/",
};

const Recommendations = () => {
  const { media_type, id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [trailer, setTrailer] = useState(null);
  const [watchProviders, setWatchProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${media_type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,watch/providers`);
        const data = await response.json();
        setMovieDetails(data);

        // Extract trailer (YouTube)
        const officialTrailer = data.videos?.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        if (officialTrailer) setTrailer(`https://www.youtube.com/embed/${officialTrailer.key}`);

        // Extract watch providers
        const providers = data["watch/providers"]?.results?.US?.flatrate || [];
        setWatchProviders(providers);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const [movieResponse, tvResponse] = await Promise.all([
          fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`),
          fetch(`${BASE_URL}/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US`)
        ]);
        
        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json()
        ]);
        
        const combinedResults = [
          ...(movieData.results || []).map(item => ({ ...item, media_type: "movie" })),
          ...(tvData.results || []).map(item => ({ ...item, media_type: "tv" }))
        ].filter(item => item.poster_path)
         .sort((a, b) => b.popularity - a.popularity);
        
        setRecommendations(combinedResults);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchMovieDetails();
    fetchRecommendations();
  }, [id, media_type]);

  return (
    <Container>
      <BreadcrumbNav movieTitle={movieDetails?.title || movieDetails?.name} />

      {movieDetails && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            minHeight: { xs: "auto", md: "400px" },
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movieDetails.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: { xs: 3, md: 5 },
            borderRadius: 3,
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            animation: "fadeIn 1s ease-in-out",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.7))", // ✅ Lighter gradient
              top: 0,
              left: 0,
              zIndex: 0,
              borderRadius: 3,
            },
            color: "#000",
          }}
        >
          {/* Movie Details Row */}
          <Grid container spacing={3} sx={{ position: "relative", zIndex: 1 }}>
            {/* Movie Poster */}
            <Grid item xs={12} md={3}>
              {movieDetails.poster_path && (
                <CardMedia
                  component="img"
                  sx={{ width: "100%", maxWidth: "250px", borderRadius: 2 }}
                  image={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                  alt={movieDetails.title || movieDetails.name}
                />
              )}
            </Grid>

            {/* Movie Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold">{movieDetails.title || movieDetails.name}</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, marginBottom: 2 }}>{movieDetails.overview}</Typography>
              <Typography variant="body1"><strong>Release Date:</strong> {movieDetails.release_date || movieDetails.first_air_date}</Typography>
              <Typography variant="body1"><strong>Genres:</strong> {movieDetails.genres?.map(g => g.name).join(", ")}</Typography>
              <Typography variant="body1"><strong>Rating:</strong> {movieDetails.vote_average ? `${movieDetails.vote_average.toFixed(1)} / 10` : "N/A"}</Typography>
              <Typography variant="body1"><strong>Runtime:</strong> {movieDetails.runtime ? `${movieDetails.runtime} min` : "N/A"}</Typography>
            </Grid>

            {/* Trailer + Available On */}
            <Grid item xs={12} md={3}>
              {trailer && (
                <Box>
                  <Typography variant="h6">Watch Trailer</Typography>
                  <iframe
                    width="100%"
                    height="160px"
                    src={trailer}
                    title="Trailer"
                    allowFullScreen
                    style={{ borderRadius: "8px" }}
                  ></iframe>
                </Box>
              )}

              {/* Available On - Directly Below Trailer */}
              {watchProviders.length > 0 && (
                <Box sx={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))", 
                  gap: 2, 
                  justifyContent: "center", 
                  alignItems: "center", 
                  width: "100%", 
                  marginTop: 2 
                }}>
                  {watchProviders.map((provider) => {
                    const providerLink = STREAMING_PLATFORMS[provider.provider_name] || "#";
                    return (
                      <IconButton
                        key={provider.provider_id}
                        href={providerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={provider.provider_name}
                        sx={{ 
                          width: 75, 
                          height: 75, 
                          display: "flex", 
                          justifyContent: "center", 
                          alignItems: "center" 
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                          alt={provider.provider_name}
                          style={{ borderRadius: "8px", width: "75px", height: "75px" }}
                        />
                      </IconButton>
                    );
                  })}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Cast List */}
      <CastList mediaType={media_type} movieId={id} />

      {/* Similar Titles Section */}
      <Typography variant="h4" sx={{ marginTop: 4 }}>Similar Titles</Typography>
      <Masonry breakpointCols={{ default: 6, 1200: 6, 900: 4, 600: 2, 400: 1 }} className="movie-masonry-grid" columnClassName="movie-masonry-column">
        {recommendations.map((movie) => (
          <Card key={movie.id} onClick={() => navigate(`/recommendations/${movie.media_type}/${movie.id}`)} sx={{ cursor: "pointer" }}>
            <CardMedia component="img" image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title || movie.name} />
          </Card>
        ))}
      </Masonry>
    </Container>
  );
};

export default Recommendations;
