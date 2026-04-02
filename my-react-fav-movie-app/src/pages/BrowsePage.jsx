import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getMoviesByYear } from "../api/tmdb";

// this function will handle returning a list of movies based on what
// we want to view. (year, studio, country, etc)
function BrowsePage() {
    const { type, value } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [heading, setHeading] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBrowseResults() {
            try {
                setLoading(true);
                setError("");

                // for now, only handle year
                if (type === "year") {
                    const data = await getMoviesByYear(value);

                    setMovies(data.results || []);
                    setHeading(`Movies Released in ${value}`);
                } else {
                    setMovies([]);
                    setHeading("Browse");
                }
            }
            catch (err) {
                console.error(err);
                setMovies([]);
                setError("Failed to load browse results.");
            }
            finally {
                setLoading(false);
            }
        }

        loadBrowseResults();
    }, [type, value]);

    return (
        <div className="movie-app">
            <SearchBar />

            {loading && <p>Loading…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <>
                    <h1>{heading}</h1>

                    <ul className="actor-movies-list">
                        {movies.map((movie) => {
                            const posterUrl = movie.poster_path
                                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                                : null;

                            return (
                                <li
                                    key={movie.id}
                                    className="actor-movie-item"
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                >
                                    {posterUrl ? (
                                        <img
                                            src={posterUrl}
                                            alt={`${movie.title} poster`}
                                            className="actor-movie-poster"
                                        />
                                    ) : (
                                        <div className="actor-movie-poster-placeholder">
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