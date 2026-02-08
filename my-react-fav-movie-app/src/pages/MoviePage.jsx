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
                    // pull movie title directly from tmbd
                    title: data.title,
                    // release_date looks like "2014-11-05", .slice(0,4) returns only first 4 indexes (2014). if not date, return msg
                    year: data.release_date ? data.release_date.slice(0,4) : "Release Data Unavailable",
                    // prepend image base url to tmdb path given, if poster doesn't exist return null
                    poster: data.poster_path ? `https://images.tmdb.org/t/p/original${data.poster_path}` : null,
                    // pull movie overview from tmdb
                    summary: data.overview,
                    // pass the runtime through our helper function to format
                    runtime: formatRuntime(data.runtime),
                    // tmdb returns genres like this:
                    //      {id: 12, name: "Adventure"},
                    //      {id: 18, name: "Drama"}
                    // we just return the genre name only
                    genre: data.genres ? data.genres.map((genre) => genre.name) : []
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

        // this function will format the runtime
        // our parameter will be minutes (ex. 90m -> 1h 30m)
        function formatRuntime(minutes) {
            // if min is null, undefined or missing, return msg
            // prevents errors like "cannot read property of undefined"
            if (!minutes && minutes !== 0) {
                return "Runtime Not Available";
            }

            // divides total minutes by 60 and removes the decimal
            // ex. 169 / 60 = 2.81 -> 2h
            const hours = Math.floor(minutes / 60);
            // modulo gives us the remainder of minutes not surpassing 60
            // ex. 169 % 60 = 49m therefore, 2h 49m
            const mins = minutes % 60;
            
            // if the movie is 1 hour or longer, show 2h 49m, otherwise show 45m
            return hours ? `${hours}h ${mins}m` : `${mins}m`
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
                    {/* title + year + summary + runtime/genre elements */}
                    <div className="movie-info">
                        <h1>{movie.title}</h1>
                        <h3>{movie.year && <span>{movie.year}</span>}</h3>
                        <p>
                            {movie.runtime && <span>{movie.runtime}</span>}
                            {movie.runtime && movie.genre.length > 0 && <span> • </span>}
                            {movie.genre.length > 0 && <span>{movie.genre.join(", ")}</span>}
                        </p>
                        <h3>{movie.summary}</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MoviePage