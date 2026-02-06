import { useState } from "react";
import searchMulti from "./api/tmdb";

function App() {
    // create state variable query (what user types)
    // inital state is an empty string
    // setQuery updates it and triggers a re-render
    const [query, setQuery] = useState("");

    // this function runs when the form is submitted
    async function handleSubmit(event) {
        // stops browser from refreshing the page when you submit the form
        event.preventDefault();

        // trim() removes leading/trailing whitespace
        // if user submits empty text or spaces, exit early
        if (!query.trim()) return;

        // try/catch block so failed network requests wont crash the app
        try {
            // calls searchMulti function with cleaned query
            // waits for it to finish, data is our json response from the tmdb
            const data = await searchMulti(query.trim());
            // print our results in the console
            console.log("TMDb results:", data.results);
        } 
        // catches any error and prints it
        catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Movies or TV Shows..."
            />
            <button>Search</button>
        </form>
    );
}

export default App