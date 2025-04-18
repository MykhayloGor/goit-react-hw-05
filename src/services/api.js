import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYjcxZWQxMmUxY2MxMjE4ZWEzYTBhM2UwZTcwYjExYSIsIm5iZiI6MTc0NDY1NDQ4OC41NjQsInN1YiI6IjY3ZmQ1MDk4MzAxNTM2MzI4NmQ5NGEzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8NmuZvscqK6cucevMtqeIVpOQ8jgI-FXOBUJcLYrURk';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  }
});

export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/day');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    console.log("Searching for:", query); // Debug log
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page: 1,
      },
    });
    console.log("API response:", response.data); 
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieCast = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data.cast;
  } catch (error) {
    console.error('Error fetching movie cast:', error);
    throw error;
  }
};

export const getMovieReviews = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/reviews`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    throw error;
  }
};

export default {
  getTrendingMovies,
  searchMovies,
  getMovieDetails,
  getMovieCast,
  getMovieReviews
};