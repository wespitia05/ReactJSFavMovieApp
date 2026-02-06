import { useState } from "react";
import searchMulti from "./api/tmdb";

function App() {
    // create state variable query (what user types)
    // inital state is an empty string
    // setQuery updates it and triggers a re-render
    const [query, setQuery] = useState("");
    // create state variable results (holds list of results)
    // inital state is an empty array
    // setResults updates it and triggers a re-render
    const [results, setResults] = useState([]);
    // create state variable errors
    // inital state is an empty string
    // setError updates it and triggers a re-render
    const [error, setError] = useState("");

    // this function runs when the form is submitted
    async function handleSubmit(event) {
        // stops browser from refreshing the page when you submit the form
        event.preventDefault();

        // trim() removes leading/trailing whitespace
        // if user submits empty text or spaces, exit early
        if (!query.trim()) return;

        // try/catch block so failed network requests wont crash the app
        try {
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
    }

    return (
        <div className="movie-app">
            <div className="search-bar">
                <form className="search-form" onSubmit={handleSubmit}>
                    <input
                        className="search-input"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search movies or TV..."
                    />
                    <button className="search-button" type="submit">Search</button>
                </form>
            </div>

            {error && <p className="error-text">{error}</p>}

            <ul className="results-list">
                {results.map((item) => {
                    const title = item.title || item.name;
                    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                    const posterPath = item.poster_path;
                    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/original${posterPath}`: null;

                    function handleClick() {
                        console.log("Clicked item:", {
                            id: item.id,
                            mediaType: item.media_type,
                            title,
                        });
                    }

                    return (
                        <li
                            key={`${item.media_type}-${item.id}`}
                            className="results-item"
                            onClick={handleClick}
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
        </div>
    );
}

export default App