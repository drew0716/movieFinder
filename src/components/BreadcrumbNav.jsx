import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BreadcrumbNav = ({ movieTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { media_type } = useParams();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }} separator="/">
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
      {pathSegments.includes("recommendations") && (
        <Typography color="textPrimary" tabIndex={0} aria-current="page">Recommendations</Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;