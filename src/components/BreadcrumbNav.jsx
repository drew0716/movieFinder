import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BreadcrumbNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query") || "";
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
      <Link color="inherit" onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
        Home
      </Link>
      {pathSegments.includes("results") && searchTerm && (
        <Typography color="textPrimary">Search Results for "{searchTerm}"</Typography>
      )}
      {pathSegments.includes("recommendations") && (
        <Typography color="textPrimary">Recommendations</Typography>
      )}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
