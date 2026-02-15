import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getActorDetails, getActorMovies } from "../api/tmdb";
import { useNavigate } from "react-router-dom";

function ActorPage() {
    // get the actor id from the url (/actor/:id)
    const {id} = useParams();
    // this constant we will use to navigate from one page to the next
    const navigate = useNavigate();

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
    // knownFor will store what the actor is known for, in this case acting
    const [knownFor, setKnownFor] = useState("");
    // knownCredits will store the amount of credits the actor is known for
    const [knownCredits, setKnownCredit] = useState(0);

    const roleText = { 
        Acting: "Films Starring",
        "Executive Producer": "Films Executive Produced By",
        Producer: "Films Produced By",
        "Co-Producer": "Films Co-Produced By",
        Story: "Films With Story By",
        Writer: "Films Written By",
        Thanks: "Films Thanked By", 
        "Memory Of": "Films In Memory Of",
        Director: "Films Directed By",
        "Co-Writer": "Films Co-Written By",
        Presenter: "Films Presented By",
        Screenplay: "Films With Screenplay By",
        "Original Story": "Films With Original Story By",
        Characters: "Films With Characters By",
        Choreographer: "Films Choreographed By",
        "Creative Consultant": "Films Creatively Consulted By",
        Editor: "Films Edited By",
        "Director of Photography": "Films Shot By",
        "Additional Camera": "Films With Additional Photography By",
        "Camera Operator": "Films With Camera Operation By",
        "Casting Director": "Films Cast By",
        "Production Assistant": "Films Assisted In Production By",
        "Sound Designer": "Films With Sound Designed By",
        "Sound Mixer": "Films With Sound Mixed By",
        "Sound Recordist": "Films With Sound Recorded By",
        "Associate Producer": "Films Associatively Produced By",
        Music: "Films With Music By",
        Songs: "Films With Songs By",
        "Assistant Director": "Films Assistant Directed By",
        "Assistant Writer": "Films Assitant Written By",
        Cinematography: "Films With Cinematography By",
        "Consulting Producer": "Films Consultantly Produced By",
        "Editorial Consultant": "Films Edited Consultantly By",
        "Original Film Writer": "Films Originally Written By",
        Other: "Other Films",
        Presenter: "Films Presented By",
        "Sound Effects Editor": "Films With Sound Effects Edited By",
        Decorator: "Films With Decoration By",
        Idea: "Films With Ideas By",
        "Original Music Composer": "Films With Music Composed By",
        "Set Designer": "Films With Set Designs By",
        Casting: "Films Cast By", 
        Driver: "Films Driven By"
    };

    function getRoleText(job) {
        return roleText[job] || `Films ${job} by`;
    }

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
                setActor(data.name); // store actor's name
                setBio(data.biography || "No biography available."); // store actor's bio
                setKnownFor(data.known_for_department || "Unknown"); // store what actor is known for

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
                // sorts movies by popularity
                actorMovies.sort((a, b) => b.popularity - a.popularity);
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

                // sort movies inside each job (newest first)
                Object.keys(group).forEach((job) => {
                    group[job].sort((a, b) => b.popularity - a.popularity);
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

                // get the number of projects the actor is know to have a role in, both cast and crew
                const uniqueIds = new Set([...actorMovies, ...actorCrewMovies].map((actorWork) => actorWork.id));
                // get the size of the unique id's and set it
                setKnownCredit(uniqueIds.size);
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
                            <div className="actor-personal">
                                {profileUrl ? (
                                    <img src={profileUrl} alt={`${actor} profile`} className="actor-profile-img"/>
                                ) : (
                                    <p>No profile image available.</p>
                                )}
                                <br></br>
                                <p>
                                    <strong>Known For:</strong> {knownFor}
                                </p>
                                <p>
                                    <strong>Known Credits:</strong> {knownCredits}
                                </p>
                            </div>
                            <div className="actor-films">
                                <p className="actor-role-heading">
                                    {getRoleText(selectedJob)}
                                </p>
                                <h1>{actor}</h1>
                                {/* actor job drop down */}
                                <div className="role-select-container">
                                    <select value={selectedJob} onChange={(event) => setSelectedJob(event.target.value)} className="role-select">
                                        {jobOptions.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <ul className="actor-movies-list">
                                    {selectedJob === "Acting"
                                        ? actorMovies.map((movie) => {
                                            const posterUrl = movie.poster_path
                                            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                                            : null;

                                            return (
                                                <li key={movie.id} className="actor-movie-item" onClick={() => navigate(`/movie/${movie.id}`)}>
                                                    {posterUrl ? (
                                                    <img
                                                        src={posterUrl}
                                                        alt={`${movie.title} poster`}
                                                        className="actor-movie-poster"
                                                    />
                                                    ) : (
                                                    <div className="actor-movie-poster-placeholder">No Image</div>
                                                    )}
                                                </li>
                                            );
                                        })
                                        : (crewMovies[selectedJob] || []).map((movie) => {
                                            const posterUrl = movie.poster_path
                                            ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                                            : null;

                                            return (
                                                <li key={`${selectedJob}-${movie.id}`} className="actor-movie-item" onClick={() => navigate(`/movie/${movie.id}`)}>
                                                    {posterUrl ? (
                                                    <img
                                                        src={posterUrl}
                                                        alt={`${movie.title} poster`}
                                                        className="actor-movie-poster"
                                                    />
                                                    ) : (
                                                    <div className="actor-movie-poster-placeholder">No Image</div>
                                                    )}
                                                </li>
                                            );
                                        })
                                    }
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