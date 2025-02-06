import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BreadcrumbNav = ({ movieTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { media_type } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query");
  const searchType = queryParams.get("type") || "multi"; // Default to "All"
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }} separator="/">
      {/* Home Link */}
      <Link 
        color="inherit" 
        onClick={() => navigate("/")} 
        sx={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => e.key === "Enter" && navigate("/")}
      >
        Home
      </Link>

      {/* Search Term in Breadcrumb when on Results Page */}
      {pathSegments.includes("results") && searchTerm && (
        <Typography color="textPrimary" tabIndex={0} aria-current="page">
          Search Term: {searchTerm} ({searchType === "multi" ? "All" : searchType === "movie" ? "Movie" : "TV Show"})
        </Typography>
      )}

      {/* Movie Title in Breadcrumb when in Recommendations */}
      {pathSegments.includes("recommendations") && movieTitle && (
        <Link 
          color="inherit" 
          onClick={() => navigate(`/results?query=${encodeURIComponent(movieTitle)}`)} 
          sx={{ cursor: "pointer" }}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => e.key === "Enter" && navigate(`/results?query=${encodeURIComponent(movieTitle)}`)}
        >
          {movieTitle} {media_type === "tv" ? "(TV Show)" : "(Movie)"}
        </Link>
      )}

      {/* Final Breadcrumb for Recommendations Page */}
      {pathSegments.includes("recommendations") && (
        <Typography color="textPrimary" tabIndex={0} aria-current="page">
          Details
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
