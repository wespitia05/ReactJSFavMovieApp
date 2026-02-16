import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getTvDetails } from "../api/tmdb";

function TvPage() {
    // get the tv id from the url (/tv/:id)
    const {id} = useParams();

    // tv will store only the values we want displayed
    const [tv, setTv] = useState(null);
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // error stores any error messages
    const [error, setError] = useState("");

    // this runs when the page loads or when the id changes
    useEffect(() => {
        // async function to fetch tv show data
        async function loadTv() {
            // try catch in case anything fails
            try {
                setLoading(true); // show loading
                setError(""); // clear any old errors

                // get full tv show data from tmdb
                const data = await getTvDetails(id);

                // create object of tv show data we want to display
                const tvData = {
                    // pull movie title directly from tmbd
                    title: data.name
                };

                // store the object in state
                setTv(tvData);
                // check in console if movie data is extracted properly
                console.log("TV Show Object Data: ", tvData);
            }
            // catch any errors
            catch (err) {
                console.error(err);
                setTv(null);
                setError("Failed to load TV show");
            }
            finally {
                setLoading(false); // stop loading
            }
        }

        loadTv();
    }, [id]);

    return(
        <>
            <div className="movie-app">
                <SearchBar />

                {loading && <p>Loading…</p>}
                {error && <p>{error}</p>}

                {!loading && !error && tv && (
                    <h1>{tv.title}</h1>
                )}
            </div>
        </>
    );
}

export default TvPage