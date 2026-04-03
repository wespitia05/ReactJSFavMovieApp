import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getMoviesByYear } from "../api/tmdb";

// this function will handle returning a list of movies based on what
// we want to view. (year, studio, country, etc)
function BrowsePage() {
    const { type, value } = useParams();
    const navigate = useNavigate();

    // movie will store only the values we want to display
    const [movies, setMovies] = useState([]);
    // heading will store only the value we want to display as our heading
    const [heading, setHeading] = useState("");
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // error stores any error messages
    const [error, setError] = useState("");
    // totalResults will store only the value of the total number of movies released in that year
    const [totalResults, setTotalResults] = useState(0);
    // sortBy will store only the value of how we will sort the movies (based on popularity)
    const [sortBy, setSortBy] = useState("popularity.desc");

    // this runs when the page loads or when the id changes
    useEffect(() => {
        // async function to fetch movie data
        async function loadBrowseResults() {
            // try catch in case anything fails
            try {
                setLoading(true); // show loading
                setError(""); // clear any old errors

                // for now, only handle year
                if (type === "year") {
                    // get full movies list released on specified year
                    const data = await getMoviesByYear(value, sortBy);

                    // put those movies into a data array
                    setMovies(data.movies || []);
                    // set the heading to display the year the movies were released
                    setHeading(`Films Released in ${value}`);
                    // set the total results value to display the total number of movies released
                    setTotalResults(data.totalResults.toLocaleString() || 0);
                } else {
                    setMovies([]);
                    setHeading("Browse");
                }
            }
            // catch any errors
            catch (err) {
                console.error(err);
                setMovies([]);
                setError("Failed to load browse results.");
            }
            finally {
                setLoading(false); // stop loading
            }
        }

        loadBrowseResults();
    }, [type, value, sortBy]);

    return (
        <div className="movie-app">
            <SearchBar />

            {loading && <p>Loading…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <>
                    <div className="browse-header">
                        <p className="movie-list-heading">{heading}</p>

                        <select
                            className="browse-select-container"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popularity.desc">Most Popular</option>
                            <option value="vote_average.desc">Highest Rated</option>
                            <option value="primary_release_date.desc">Newest First</option>
                            <option value="primary_release_date.asc">Oldest First</option>
                        </select>
                    </div>
                    <p className="movie-total-number">There are {totalResults} films released in {value}</p>
                    <ul className="movies-list">
                        {movies.map((movie) => {
                            const posterUrl = movie.poster_path
                                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                                : null;

                            return (
                                <li
                                    key={movie.id}
                                    className="movie-list-item"
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                >
                                    {posterUrl ? (
                                        <img
                                            src={posterUrl}
                                            alt={`${movie.title} poster`}
                                            className="movie-list-poster"
                                        />
                                    ) : (
                                        <div className="movie-list-poster-placeholder">
                                            No Image
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}

export default BrowsePage;