import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getMovieDetails } from "../api/tmdb";

function MoviePage() {
    // get the movie id from the url (/movie/:id)
    const {id} = useParams();

    // movie will store only the values we want to display
    const [movie, setMovie] = useState(null);
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // error stores any error messages
    const [error, setError] = useState("");

    // this runs when the page loads or when the id changes
    useEffect(() => {
        // async function to fetch movie data
        async function loadMovie() {
            // try catch in case anything fails
            try {
                setLoading(true); // show loading
                setError(""); // clear any old errors

                // get full movie data from tmdb
                const data = await getMovieDetails(id);
                // create object of movie data we want to display
                const movieData = {
                    title: data.title,
                    year: data.release_date ? data.release_date.slice(0,4) : "Release Data Unavailable",
                    poster: data.poster_path ? `https://images.tmdb.org/t/p/original${data.poster_path}` : null,
                    summary: data.overview
                };

                // store the object in state
                setMovie(movieData);
                // check in console if movie data is extracted properly
                console.log("Movie Object Data: ", movieData);
            }
            // catch any errors
            catch (err) {
                console.error(err);
                setMovie(null);
                setError("Failed to load movie.");
            }
            finally {
                setLoading(false); // stop loading
            }
        }
        loadMovie();
    }, [id]);

    return (
        <div className="movie-app">
            <SearchBar />

            {loading && <p>Loading…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && movie && (
                <div className="movie-basic">
                    {/* poster element */}
                    {movie.poster ? (
                        <img
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            className="movie-poster"
                        />
                    ) : (
                        <p>No Poster Available</p>
                    )}
                    {/* title + year + summary elements */}
                    <div className="movie-info">
                        <h1>
                            {movie.title}
                            {movie.year && <span>({movie.year})</span>}
                        </h1>
                        <h2>{movie.summary}</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MoviePage