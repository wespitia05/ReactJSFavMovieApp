import React, {useState} from "react";
import {searchMulti} from "../api/tmdb";
import {useNavigate} from "react-router-dom";

function SearchBar() {
    // create state variable query (what user types)
    // inital state is an empty string
    // setQuery updates it and triggers a re-render
    const [query, setQuery] = useState("");
    // this constant we will use to navigate from one page to the next
    const navigate = useNavigate();

    // this function runs when the form is submitted
    async function handleSubmit(event) {
        // stops browser from refreshing the page when you submit the form
        event.preventDefault();

        // trim() removes leading/trailing whitespace
        // if user submits empty text or spaces, exit early
        if (!query.trim()) return;

        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }

    return (
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
    );
}

export default SearchBar