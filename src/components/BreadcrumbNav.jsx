import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BreadcrumbNav = ({ movieTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || "";
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }} separator="/">
      <Link color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
        Home
      </Link>
      {pathSegments.includes("results") && searchTerm && (
        <Typography color="textPrimary">Search Results for "{searchTerm}"</Typography>
      )}
      {pathSegments.includes("recommendations") && movieTitle && (
        <Link color="inherit" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
          {movieTitle}
        </Link>
      )}
      {pathSegments.includes("recommendations") && (
        <Typography color="textPrimary">Movie Info & Recommendations</Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
