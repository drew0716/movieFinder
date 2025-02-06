import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem, Select, FormControl, InputLabel, Button, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const SearchBar = ({ searchTerm, setSearchTerm, searchCategory, setSearchCategory }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [trendingResults, setTrendingResults] = useState([]);
  const navigate = useNavigate();

  // Fetch trending content
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/trending/${searchCategory === "multi" ? "all" : searchCategory}/week?api_key=${API_KEY}`
        );
        setTrendingResults(response.data.results || []);
      } catch (error) {
        console.error("Error fetching trending results:", error);
      }
    };
    fetchTrending();
  }, [searchCategory]);

  // Fetch search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(trendingResults);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/search/${searchCategory}?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
        );
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
    };

    const delayDebounceFn = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchCategory, trendingResults]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const searchValue = searchTerm.trim();
    if (!searchValue) return;
    
    navigate(`/results?query=${encodeURIComponent(searchValue)}&type=${searchCategory}`);
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (event, value) => {
    if (value) {
      const title = value.name || value.title;
      setSearchTerm(title);
      navigate(`/results?query=${encodeURIComponent(title)}&type=${searchCategory}`);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        width: "100%",
        maxWidth: 900,
        alignItems: "center",
      }}
    >
      <FormControl variant="outlined" size="small" sx={{ minWidth: { xs: "100%", sm: "150px" } }}>
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

      <Autocomplete
        freeSolo
        options={searchTerm.trim() ? searchResults : [{ isHeader: true }, ...trendingResults]}
        getOptionLabel={(option) => 
          option.isHeader ? "Trending" : option.name || option.title || ""
        }
        renderOption={(props, option) => 
          option.isHeader ? (
            <li {...props} style={{ fontWeight: 'bold', background: '#f5f5f5' }}>
              🔥 Trending
            </li>
          ) : (
            <li {...props}>{option.name || option.title}</li>
          )
        }
        onInputChange={(event, newValue) => setSearchTerm(newValue)}
        onChange={handleAutocompleteSelect}
        inputValue={searchTerm}
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Search ${searchCategory !== "multi" ? searchCategory : "content"}...`}
            variant="outlined"
            size="small"
          />
        )}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ height: 40, px: 3, width: { xs: "100%", sm: "auto" } }}
      >
        <SearchIcon />
      </Button>
    </Box>
  );
};

export default SearchBar;
