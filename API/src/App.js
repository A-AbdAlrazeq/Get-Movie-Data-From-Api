import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/"); //default method is get
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      //await mean wait until the req is finished
      //async and await make the code more cleaner
      // you must wrap the code in function if you want use async and await
      // we use (try,catch)if we want to catch error when we use async and await
      //js is single thread one thing happen in same time
      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);

      //the data is returned as json format it's easy to translate it to js object
    } catch (error) {
      setError(error.message);
      //fetch api doesn't throw a real error it's just give the status code error
      //so it's better to use axios library because it throw a real error
    }
    setIsLoading(false);
  }, []);
  /*
    so this mean the function will be created just one time because we pass empty array when the app first
    rendered
     */

  useEffect(() => {
    fetchMoviesHandler();
  }, [
    fetchMoviesHandler,
  ]); /* so when we use use effect the data fitch immediately if it empty array
   in dep fetch just the first render, if we add the function in array dep it will cause infinite loop 
   because the function always re-execute when the component re-render
   so we must use callback in the main function to prevent the function from re-create,so we pass
   empty array in callback dep to create the fun just one time when it rendered first time
   */

  /* instead of this
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && (
          <p>Found no movies. </p>
        )}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading... </p>} 
        we can use this*/
  let content = <p>Found no movies. </p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading... </p>;
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
