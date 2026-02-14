import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getActorDetails, getActorMovies } from "../api/tmdb";

function ActorPage() {
    // get the actor id from the url (/actor/:id)
    const {id} = useParams();

    // actor will store only the values we want to display
    const [actor, setActor] = useState(null);
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // error stores any error messages
    const [error, setError] = useState("");
    // profileUrl will store the value of the actors profile image
    const [profileUrl, setProfileUrl] = useState(null);
    const [bio, setBio] = useState("");

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
                // log for debugging
                // console.log(data);

                // store the object in state
                setActor(data.name);
                setBio(data.biography || "No biography available.");

                // url will extract the path to the actors image profile and set it
                const url = data.profile_path
                    ? `https://image.tmdb.org/t/p/original${data.profile_path}`
                    : null;
                setProfileUrl(url);

                // get list of movies selected actor has been in
                const credits = await getActorMovies(id);
                // log for debugging
                console.log("Movies " + data.name + " has starred in: ", credits.cast);
                console.log("Movies " + data.name + " has worked on: ", credits.crew);
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

                {!loading && !error && (
                    <>
                        <div className="actor-basic">
                            {profileUrl ? (
                                <img src={profileUrl} alt={`${actor} profile`} className="actor-profile-img"/>
                            ) : (
                                <p>No profile image available.</p>
                            )}
                            <div className="actor-films">
                                <p>Films Starring</p>
                                <h1>{actor}</h1>
                            </div>
                            <div className="actor-info">
                                <p>Biography</p>
                                <h4>{bio}</h4>
                            </div>                          
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default ActorPage