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

                // initialize directorName as an empty string
                let directorName = "";

                // only try to read crew if credits exists
                if (data.credits && data.credits.crew) {
                    // crew is an array of people, find returns first match where condition is true
                    const director = data.credits.crew.find(
                        (person) => person.job === "Director"
                    );

                    // if we found the director, set the name
                    if (director) {
                        directorName = director.name;
                        console.log(`Director: ${directorName}`); // log for debugging
                    }
                }

                // initialize certification as an empty string
                let certification = "";

                // only try if the release dates exist (certification exists in there)
                if (data.release_dates && data.release_dates.results) {
                    // results is an array of countries, we find our own by looping through
                    // the array until we find the first match and we save it in usRelease constant
                    const usRelease = data.release_dates.results.find(
                        (rating) => rating.iso_3166_1 === "US"
                    );

                    // if we found the US entry AND that entry has a release_date array
                    if (usRelease && usRelease.release_dates) {
                        // loops through all US release entries and finds the first one that has a 
                        // certification and its not an empty string, and saves it in the rated constant
                        const rated = usRelease.release_dates.find(
                            (d) => d.certification && d.certification.trim() !== ""
                        );
                        // if we found the valid rating, save it in our certification variable
                        if (rated) {
                            certification = rated.certification;
                            console.log(`Rated: ${certification}`); // log for debugging
                        }
                    }
                }

                // create object of movie data we want to display
                const movieData = {
                    // pull movie title directly from tmbd
                    title: data.title,
                    // release_date looks like "2014-11-05", .slice(0,4) returns only first 4 indexes (2014). if not date, return msg
                    year: data.release_date ? data.release_date.slice(0,4) : "Release Data Unavailable",
                    // prepend image base url to tmdb path given, if poster doesn't exist return null
                    poster: data.poster_path ? `https://images.tmdb.org/t/p/original${data.poster_path}` : null,
                    // pull movie overview from tmdb
                    summary: data.overview || "No Summary Available",
                    // pass the runtime through our helper function to format
                    runtime: formatRuntime(data.runtime),
                    // tmdb returns genres like this:
                    //      {id: 12, name: "Adventure"},
                    //      {id: 18, name: "Drama"}
                    // we just return the genre name only
                    genre: data.genres ? data.genres.map((genre) => genre.name) : [],
                    // pass the directors name from tmdb
                    director: directorName,
                    tagline: data.tagline,
                    rating: certification
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
                        <h3>
                            {/* only render the year if it exists */}
                            {movie.year && <span><u>{movie.year}</u></span>}
                            {/* only show the bullet if both year and director exist */}
                            {movie.year && movie.director && <span> • </span>}
                            {/* renders the director text */}
                            {movie.director && <span>Directed By <u>{movie.director}</u></span>}
                        </h3>
                        <p>
                            {/* only render the runtime if it exists */}
                            {movie.runtime && <span>{movie.runtime}</span>}
                            {/* only show bullet if noth runtime and genre exists */}
                            {movie.runtime && movie.genre.length > 0 && <span> • </span>}
                            {/* if there is more than one genre, separate with a comma */}
                            {movie.genre.length > 0 && <span>{movie.genre.join(", ")}</span>}
                            {/* only show bullet if runtime, genre and rating exists */}
                            {movie.runtime && movie.genre.length > 0 && movie.rating && <span> • </span>}
                            {/* only render the rating if it exists */}
                            {movie.rating && (
                                <span className="movie-rating">{movie.rating}</span>
                            )}
                        </p>
                        <h3><i>{movie.tagline}</i></h3>
                        <h3>{movie.summary}</h3>
                    </div>
                    <div className="movie-modal">
                        <div className="movie-modal-content">
                            <ul>
                                <li>Rating: ⭐️⭐️⭐️⭐️⭐️</li>
                                <hr />
                                <li>Change Poster</li>
                                <hr />
                                <li>Change Backdrop</li>
                                <hr />
                                <li>Streaming</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MoviePage