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
    // bio will store the biography of the selected actor
    const [bio, setBio] = useState("");
    // movies will store the movies the actor has been in
    const [actorMovies, setActorMovies] = useState([]);
    // crewMovies will store the movies the actor has worked on
    const [crewMovies, setCrewMovies] = useState({}); // {"Producer": [movies...], "Executive Producer": [movies...]}
    // jobOptions will store the different job available for selected actor
    const [jobOptions, setJobOptions] = useState([]); // ["Acting", "Producer", ...]
    // selectedJob will store the current selected job to be displayed
    const [selectedJob, setSelectedJob] = useState("Acting");

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

                // only movies the actor has acted in
                const actorMovies = credits.cast || [];
                // store the object in state
                setActorMovies(actorMovies);

                // only movies the actor has worked on
                const actorCrewMovies = credits.crew || [];
                const group = {}; // job -> array of movies

                // loop through each movie the actor has under their name
                actorCrewMovies.forEach((item) => {
                    // job constant will extract the job title
                    const job = item.job;

                    // if a movie has no job defined, return null
                    if (!job) {
                        return null;
                    }

                    // create job group if it doesn't exist
                    if (!group[job]) {
                        group[job] = [];
                    }

                    // check if the job already contains a movie with this id
                    // if not, we push it
                    if (!group[job].some((dup) => dup.id === item.id)) {
                        group[job].push(item);
                    }
                });
                // store object in state
                setCrewMovies(group);
                // log for debugging
                // console.log(group);

                // always include Acting + all unique crew jobs
                const crewJobs = Object.keys(group).sort();
                // create the array of options
                const options = ["Acting", ...crewJobs];
                // store object in state
                setJobOptions(options);

                // keep selectedRole valid if actor has no crew roles
                if (selectedJob !== "Acting" && !group[selectedRole]) {
                setSelectedJob("Acting");
                }
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
                                {/* actor job drop down */}
                                <select value={selectedJob} onChange={(event) => setSelectedJob(event.target.value)}>
                                    {jobOptions.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                <ul>
                                    {selectedJob === "Acting" ? actorMovies.map((movie) => (
                                        <li key={`${selectedJob} - ${movie.id}`}>
                                            {movie.title}
                                        </li>
                                    ))
                                    : (crewMovies[selectedJob] || []).map((movie) => (
                                        <li>{movie.title}</li>
                                    ))}
                                </ul>
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