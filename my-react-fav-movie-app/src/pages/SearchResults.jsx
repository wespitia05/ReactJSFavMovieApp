import React, {useEffect, useState} from "react";
import {searchMulti} from "../api/tmdb";
import {useNavigate, useLocation} from "react-router-dom";
import SearchBar from "../components/SearchBar";

function SearchResults() {
    // this constant we will use to navigate from one page to the next
    const navigate = useNavigate();
    // this constant we will use as an object that represents the current URL
    // basically gets the name of the movie
    const location = useLocation();
    // create state variable results (holds list of results)
    // inital state is an empty array
    // setResults updates it and triggers a re-render
    const [results, setResults] = useState([]);
    // create state variable errors
    // inital state is an empty string
    // setError updates it and triggers a re-render
    const [error, setError] = useState("");
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // get ?q= from URL, takes it and turns it into something we can easily read
    // ex. ?q=batman, location.search returns just "batman"
    const params = new URLSearchParams(location.search);
    // take the value from params (movie name) and save it under the constant query
    const query = params.get("q");

    useEffect(() => {
        // trim() removes leading/trailing whitespace
        // if user submits empty text or spaces, exit early
        if (!query.trim()) return;

        async function loadResults() {
            // try/catch block so failed network requests wont crash the app
            try {
                setLoading(true);
                setError(""); // clears any previous errors
                // calls searchMulti function with cleaned query
                // waits for it to finish, data is our json response from the tmdb
                const data = await searchMulti(query.trim());

                // filters our results to be either movies or tv shows
                const results = (data.results || []).filter(
                    (item) => item.media_type === "movie" || item.media_type === "tv"
                );

                // print our results in the console
                console.log("TMDb results:", data.results);
                setResults(results);
            } 
            // catches any error and prints it
            catch (err) {
                console.error(err);
                setResults([]); // clears results array in case of an error
                setError("Search Failed. Try Again.");
            }
            finally {
                setLoading(false);
            }
        }
        loadResults();
    }, [query]);

    // this function handles when select a movie or tv from the results
    function handleResultClick(item) {
        if (item.media_type === "movie") {
            navigate(`/movie/${item.id}`);
            setResults([]); // clears results after we click on a movie
            return;
        }

        if (item.media_type === "tv") {
            navigate(`/tv/${item.id}`);
            setResults([]); // clears results after we click on a movie
            return;
        }
    }

    return(
        <div className="movie-app">
            <SearchBar />

            {loading && <p>Loading…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <ul className="results-list">
                    {results.map((item) => {
                        const title = item.title || item.name;
                        const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                        const posterPath = item.poster_path;
                        const posterUrl = posterPath ? `https://image.tmdb.org/t/p/original${posterPath}`: null;

                        return (
                            <li
                                key={`${item.media_type}-${item.id}`}
                                className="results-item"
                                onClick={() => handleResultClick(item)}
                            >
                                {posterUrl ? (
                                    <img
                                        src={posterUrl}
                                        alt={`${title} poster`}
                                        className="results-poster"
                                    />
                                ) : (
                                    <div className="poster-placeholder">No Image</div>
                                )}

                                <div className="results-info">
                                    <span className="results-title">{title}</span>
                                    {year && <span className="results-year"> ({year})</span>}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default SearchResults