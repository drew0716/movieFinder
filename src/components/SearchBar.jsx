import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, Grid, FormControl, InputLabel } from "@mui/material";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const [searchType, setSearchType] = useState("movie");

  const handleTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ marginBottom: 3 }}>
      {/* Search Type Dropdown */}
      <Grid item xs={12} sm={3} md={2}>
        <FormControl fullWidth>
          <InputLabel>Search For</InputLabel>
          <Select value={searchType} onChange={handleTypeChange} label="Search For">
            <MenuItem value="movie">Movies</MenuItem>
            <MenuItem value="tv">TV Shows</MenuItem>
            <MenuItem value="person">Actors</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Search Input */}
      <Grid item xs={12} sm={6} md={6}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a Movie, TV Show, or Actor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Grid>

      {/* Search Button */}
      <Grid item xs={12} sm={3} md={2}>
        <Button 
          fullWidth 
          variant="contained" 
          color="primary" 
          onClick={() => handleSearch(searchType)}
        >
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
