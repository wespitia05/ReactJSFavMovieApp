import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getTvDetails, getTvImages } from "../api/tmdb";

function TvPage() {
    // get the tv id from the url (/tv/:id)
    const {id} = useParams();

    // tv will store only the values we want displayed
    const [tv, setTv] = useState(null);
    // loading tells us if we are waiting for the api
    const [loading, setLoading] = useState(true);
    // error stores any error messages
    const [error, setError] = useState("");
    // backdrop will store the value of our backdrop based on the movie
    const [backdrop, setBackdrop] = useState([]);
    // backdropIndex will store the index of the backdrop based on its location in the array of backdrops
    const [backdropIndex, setBackdropIndex] = useState(0);
    // poster will store the value of our poster based on the movie
    const [poster, setPoster] = useState([]);
    // posterIndex will store the index of the poster based on its location in the array of backdrops
    const [posterIndex, setPosterIndex] = useState(0);

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

                // initialize certification as an empty string
                let certification = "";

                if (data.content_ratings && data.content_ratings.results) {
                    const us = data.content_ratings.results.find((r) => r.iso_3166_1 === "US");
                    if (us && us.rating) {
                        certification = us.rating;
                    }
                }


                // awaits api call to retrieve images object (which hold posters and backdrops)
                const images = await getTvImages(id);
                // create backdrop list based on array of backdrops, otherwise use empty array
                const backdropList = images.backdrops || [];
                // create poster list based on array of posters, otherwise use empty array
                const posterList = images.posters || [];

                // store entire array of backdrops into a react state
                // this allows you to cycle through them later
                setBackdrop(backdropList);
                setPoster(posterList);
                // resets the index back to the starting point
                setBackdropIndex(0);
                setPosterIndex(0);

                // log for debugging
                // console.log("Backdrop Count: ", backdropList.length);
                // console.log("Poster Count: ", posterList.length);

                // accesses one poster object from the array, if the poster exists get its file_path otherwise return null
                const currentPosterPath = posterList[posterIndex]?.file_path || null;
                // if current poster path exists, prepend tmdb's image base url. otherwise return null
                const currentPosterUrl = currentPosterPath
                    ? `https://image.tmdb.org/t/p/original${currentPosterPath}`
                    : null;
                // accesses one backdrop object from the array, if the backdrop exists get its file_path otherwise return null
                const currentBackdropPath = backdropList[backdropIndex]?.file_path || null;
                // if current poster path exists, prepend tmdb's image base url. otherwise return null
                const currentBackdropUrl = currentBackdropPath
                    ? `https://image.tmdb.org/t/p/original${currentBackdropPath}`
                    : null;

                // create object of tv show data we want to display
                const tvData = {
                    // pull movie title directly from tmbd
                    title: data.name,
                    // prepend image base url to tmdb path given, if poster doesn't exist return null
                    poster: currentPosterUrl,
                    // prepend image base url to tmdb path given, if backdrop doesn't exist return null
                    backdrop: currentBackdropUrl,
                    // release_date looks like "2014-11-05", .slice(0,4) returns only first 4 indexes (2014). if not date, return msg
                    year: data.first_air_date ? data.first_air_date.slice(0, 4) : "Release Data Unavailable",
                    // pull the tv shows rating certification
                    rating: certification,
                    // pull the number of seasons the tv show has
                    seasons: data.number_of_seasons,
                    // pull the number of episodes the tv show has
                    episodes: data.number_of_episodes
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
            <div className="backdrop-container" style={{
                    backgroundImage: tv?.backdrop ? `url(${tv.backdrop})` : "none",
                    }}> 
                <div className="movie-app">
                    <SearchBar />

                    {loading && <p>Loading…</p>}
                    {error && <p>{error}</p>}

                    {!loading && !error && tv && (
                        <>
                            <div className="tv-basic">
                                {/* poster element */}
                                {tv.poster ? (
                                        <img
                                            src={tv.poster}
                                            alt={`${tv.title} poster`}
                                            className="tv-poster"
                                        />
                                    ) : (
                                        <p>No Poster Available</p>
                                    )}
                                    <div className="tv-info">
                                        <h1>{tv.title}</h1>
                                        <p>
                                            {/* only render seasons if it exists */}
                                            {tv.seasons && (<span>{tv.seasons} Season{tv.seasons > 1 ? "s" : ""}</span>)}
                                            {/* only show bullet if seasons AND episodes exist */}
                                            {tv.seasons && tv.episodes && <span> • </span>}
                                            {/* only render episodes if it exists */}
                                            {tv.episodes && (<span>{tv.episodes} Episode{tv.episodes > 1 ? "s" : ""}</span>)}
                                            {/* only show bullet if seasons/episodes AND rating exist */}
                                            {(tv.seasons || tv.episodes) && tv.rating && <span> • </span>}
                                            {/* only render rating if it exists */}
                                            {tv.rating && (<span className="movie-rating">{tv.rating}</span>)}
                                            {/* only show bullet if rating AND status exist */}
                                            {tv.rating && tv.status && <span> • </span>}
                                            {/* only render status if it exists */}
                                            {tv.status && (<span>{tv.status}</span>)}
                                        </p>
                                    </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default TvPage