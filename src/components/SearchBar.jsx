import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem, Select, FormControl, InputLabel, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, searchCategory, setSearchCategory }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [trendingResults, setTrendingResults] = useState([]);

  // Fetch trending movies and TV shows for initial display
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/trending/${searchCategory === "multi" ? "all" : searchCategory}/week?api_key=${API_KEY}&language=en-US`);
        setTrendingResults(response.data.results || []);
      } catch (error) {
        console.error("Error fetching trending results:", error);
      }
    };

    fetchTrending();
  }, [searchCategory]); // Re-fetch trending when category changes

  // Fetch autocomplete results based on search input and category
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(trendingResults); // Show trending when input is empty
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/search/${searchCategory}?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=1`
        );
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300); // Debounce API calls for better performance

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchCategory, trendingResults]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "900px", marginBottom: 3 }}>
      {/* Category Selector */}
      <FormControl variant="outlined" size="small" sx={{ minWidth: 130, marginRight: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          label="Category"
        >
          <MenuItem value="multi">All</MenuItem>
          <MenuItem value="movie">Movies</MenuItem>
          <MenuItem value="tv">TV Shows</MenuItem>
        </Select>
      </FormControl>

      {/* Autocomplete Search Input */}
      <Autocomplete
        freeSolo
        options={searchResults}
        getOptionLabel={(option) => option.name || option.title || ""}
        onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
        onChange={(event, newValue) => {
          if (newValue) {
            setSearchTerm(newValue.name || newValue.title);
            handleSearch();
          }
        }}
        sx={{ flexGrow: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search ${searchCategory === "multi" ? "movies, TV shows..." : searchCategory === "movie" ? "movies..." : "TV shows..."}`}
            variant="outlined"
            size="small"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        )}
      />

      {/* Search Button */}
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ marginLeft: 2, height: "40px" }} 
        onClick={handleSearch}
      >
        <SearchIcon />
      </Button>
    </Box>
  );
};

export default SearchBar;
