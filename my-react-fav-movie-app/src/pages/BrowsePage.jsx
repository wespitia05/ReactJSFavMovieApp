import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getMoviesByYear, getMoviesByStudio, getMoviesByCountry, getMoviesByPrimaryLanguage, getMoviesByGenre, getMoviesByTheme } from "../api/tmdb";
import { useSearchParams, useLocation } from "react-router-dom";

// this function will handle returning a list of movies based on what
// we want to view. (year, studio, country, etc)
function BrowsePage() {
    const { type, value, name } = useParams();
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
    // gridSize will store the amount of movies display per row, default is 10 per row
    const [gridSize, setGridSize] = useState(10);
    // totalPages will store the total amount of pages we can visit, default is page 1
    const [totalPages, setTotalPages] = useState(1);
    // page will store the page we are currently displaying, default is page 1
    const [page, setPage] = useState(1);
    // currentYear will convert the url value into a number
    const currentYear = Number(value);
    // start of the current decade
    const decadeStart = Math.floor(currentYear / 10) * 10;
    // array of years in the current decade
    const decadeYears = Array.from({ length: 10 }, (_, index) => decadeStart + index);
    // previous and next decade labels
    const previousDecade = decadeStart - 10;
    const nextDecade = decadeStart + 10;
    // getting today's date/current year
    const today = new Date();
    const currentRealYear = today.getFullYear();
    // finds the name of the studio to display it
    const [searchParams] = useSearchParams();
    const studioName = searchParams.get("name");
    // finds the name of the country and displays it
    const location = useLocation();
    const countryName = location.state?.name;
    const displayName = location.state?.name;
    const source = location.state?.source;
    // finds the genre and theme of the movie and displays it
    const genreName = location.state?.name;
    const themeName = location.state?.name;
    // finds the media type we are currently viewing (movie or tv show)
    const mediaType = location.state?.mediaType;

    // reset page when year/type/sort changes
    useEffect(() => {
        setPage(1);
    }, [type, value, sortBy]);

    // this function will load a chunk of 50 movies
    async function loadPage(targetPage) {
        try {
            setLoading(true); // show loading
            setError(""); // clear any old errors

            // for now, only handle year
            if (type === "year") {
                // get full movies list released on specified year
                const data = await getMoviesByYear(value, mediaType, sortBy, targetPage);

                // put those movies into a data array
                setMovies(data.movies || []);
                // set the heading to display the year the movies were released
                setHeading(`Films Released in ${value}`);
                // set the total results value to display the total number of movies released
                setTotalResults(data.totalResults.toLocaleString() || 0);
                setTotalPages(data.totalPages || 1);
                setPage(targetPage);
            } 
            else if (type === "studio") {
                // get full movies list released on specified year
                const data = await getMoviesByStudio(value, mediaType, sortBy, targetPage);

                // put those movies into a data array
                setMovies(data.movies || []);
                // set the heading to display the studio of either the movie or tv show
                if (mediaType === "tv") {
                    setHeading(`TV Shows Produced By ${studioName}`);
                }
                else {
                    setHeading(`Films Produced By ${studioName}`);
                }
                // set the total results value to display the total number of movies released
                setTotalResults(data.totalResults.toLocaleString() || 0);
                setTotalPages(data.totalPages || 1);
                setPage(targetPage);
            }
            else if (type === "country") {
                // get full movies list released on specified year
                const data = await getMoviesByCountry(value, sortBy, targetPage);

                // put those movies into a data array
                setMovies(data.movies || []);
                // set the heading to display the year the movies were released
                setHeading(`Films Produced by ${countryName}`);
                // set the total results value to display the total number of movies released
                setTotalResults(data.totalResults.toLocaleString() || 0);
                setTotalPages(data.totalPages || 1);
                setPage(targetPage);
            }
            else if (type === "language") {
                // get full movies list released on specified year
                const data = await getMoviesByPrimaryLanguage(value, sortBy, targetPage);

                // put those movies into a data array
                setMovies(data.movies || []);
                if (displayName) {
                    if (source === "primary") {
                        // set the heading to display the year the movies were released
                        setHeading(`Films with ${displayName} as its Primary Language`);
                    }
                    else if (source === "spoken") {
                        // set the heading to display the year the movies were released
                        setHeading(`Films with ${displayName} as a Spoken Language`);
                    }
                }
                // set the total results value to display the total number of movies released
                setTotalResults(data.totalResults.toLocaleString() || 0);
                setTotalPages(data.totalPages || 1);
                setPage(targetPage);
            }
            else if (type === "genre") {
                // get full movies list released on specified year
                const data = await getMoviesByGenre(value, mediaType, sortBy, targetPage);

                // put those movies into a data array
                setMovies(data.movies || []);
                // set the heading to display the genre of either the movie or tv show
                if (mediaType === "tv") {
                    setHeading(`${genreName} TV Shows`);
                }
                else {
                    setHeading(`${genreName} Films`);
                }
                // set the total results value to display the total number of movies released
                setTotalResults(data.totalResults.toLocaleString() || 0);
                setTotalPages(data.totalPages || 1);
                setPage(targetPage);
            }
            else if (type === "theme") {
                // get full movies list released on specified year
                const data = await getMoviesByTheme(value, mediaType, sortBy, targetPage);

                // put those movies into a data array
                setMovies(data.movies || []);
                // set the heading to display the theme of either the tv show or movie
                if (mediaType === "tv") {
                    setHeading(`TV Shows About ${themeName}`);
                }
                else {
                    setHeading(`Films About ${themeName}`);
                }
                // set the total results value to display the total number of movies released
                setTotalResults(data.totalResults.toLocaleString() || 0);
                setTotalPages(data.totalPages || 1);
                setPage(targetPage);
            }
            else {
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

    // this runs when the page loads or when the id changes
    useEffect(() => {
        loadPage(1);
    }, [type, value, sortBy]);

    // this function will go to the next chunk of 50 movies
    async function handleNext() {
        const nextPage = page + 3;

        // if the next page exceeds the total available pages, stop
        if (nextPage > totalPages) {
            return;
        }

        await loadPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // this function will go to the previous chunk of 50 movies
    async function handlePrev() {
        const prevPage = Math.max(page - 3, 1);

        await loadPage(prevPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // currentChunk will store the current 50-movie chunk being displayed
    const currentChunk = Math.floor((page - 1) / 3) + 1;
    // maxChunks will store the total amount of 50-movie chunks available
    const maxChunks = Math.ceil(totalPages / 3);
    // labelText will store the total results text for language browse
    let labelText = "";

    if (type === "language") {
        if (displayName) {
            if (source === "primary") {
                labelText = `films with ${displayName} as its primary language`;
            }
            else if (source === "spoken") {
                labelText = `films with ${displayName} as a spoken language`;
            }
            else {
                labelText = `films in ${displayName}`;
            }
        }
    }

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

                        <div className="grid-buttons">
                            <button onClick={() => setGridSize(10)} className="grid-10-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <rect x="2" y="2" width="8" height="8" />
                                    <rect x="12" y="2" width="8" height="8" />
                                    <rect x="2" y="12" width="8" height="8" />
                                    <rect x="12" y="12" width="8" height="8" />
                                </svg>
                            </button>

                            <button onClick={() => setGridSize(5)} className="grid-5-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <rect x="2" y="2" width="14" height="20" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {type === "studio" && (
                        <p className="movie-total-number">
                            There are {totalResults} films produced by {studioName}
                        </p>
                    )}
                    {type === "country" && (
                        <p className="movie-total-number">
                            There are {totalResults} films produced by {countryName}
                        </p>
                    )}
                    {type === "language" && (
                        <p className="movie-total-number">
                            There are {totalResults} {labelText}
                        </p>
                    )}
                    {type === "genre" && (
                        <p className="movie-total-number">
                            There are {totalResults}{" "}
                            {mediaType === "tv"
                                ? `${genreName} TV shows`
                                : `${genreName} films`}
                        </p>
                    )}
                    {type === "theme" && (
                        <p className="movie-total-number">
                            There are {totalResults}{" "}
                            {mediaType === "tv"
                                ? `TV shows with "${themeName}" as the theme`
                                : `films with "${themeName}" as the theme`}
                        </p>
                    )}
                    {type === "year" && (
                        <>
                            <p className="movie-total-number">
                                There are {totalResults} films released in {value}
                            </p>
                            <div className="year-browser">
                                <button
                                    className="decade-nav-button"
                                    onClick={() => navigate(`/browse/year/${previousDecade}`)}
                                    type="button"
                                >
                                    &lt; {previousDecade}s
                                </button>

                                <div className="year-browser-list">
                                    {decadeYears.map((year) => (
                                        <button
                                            key={year}
                                            className={`year-browser-button ${year === currentYear ? "active" : ""}`}
                                            onClick={() => navigate(`/browse/year/${year}`)}
                                            type="button"
                                            disabled={year > currentRealYear}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="decade-nav-button"
                                    onClick={() => navigate(`/browse/year/${nextDecade}`)}
                                    type="button"
                                    disabled={nextDecade > currentRealYear}
                                >
                                    {nextDecade}s &gt;
                                </button>
                            </div>
                        </>
                    )}

                    <ul className={`movies-list grid-${gridSize}`}>
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

                    <div className="browse-pagination">
                        <button className="browse-page-button" onClick={handlePrev} disabled={page === 1}>
                            Previous
                        </button>
                        <button className="browse-page-button" onClick={handleNext} disabled={currentChunk >= maxChunks}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default BrowsePage;