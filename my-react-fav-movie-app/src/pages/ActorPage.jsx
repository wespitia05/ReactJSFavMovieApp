import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getActorDetails } from "../api/tmdb";

function ActorPage() {
    // get the actor id from the url (/actor/:id)
    const {id} = useParams();

    // actor will store only the values we want to display
    const [actor, setActor] = useState(null);
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // error stores any error messages
    const [error, setError] = useState("");

    // this runs when the page loads or when the id changes
    useEffect(() => {
        // async function to fetch actor data
        async function loadActor() {
            // try catch in case anything fails
            try {
                setLoading(true); // show loading
                setError(""); // clear any old errors

                // get full actor data from tmdb
                const data = await getActorDetails(id);
                // store the object in state
                setActor(data.name);
                // check in console if actor data is extracted properly
                console.log("Actor Data: ", data.name);
            }
            // catch any errors
            catch (err) {
                console.error(err);
                setActor(null);
                setError("Failed to load actor.");
            }
            finally {
                setLoading(false); // stop loading
            }
        }
        loadActor();
    }, [id]);

    return(
        <>
            <div className="movie-app">
                <SearchBar />

                {loading && <p>Loading…</p>}
                {error && <p>{error}</p>}

                {!loading && !error && <h1>{actor}</h1>}
            </div>
        </>
    );
}

export default ActorPage