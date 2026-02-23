import { useParams } from "react-router-dom";
import { getTvDetails, getTvImages, getTvSeasonDetails } from "../api/tmdb";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";

function TvSeasonPage() {
    // gets the tv show id and season number from the url
    const {id, seasonNumber} = useParams();

    const [season, setSeason] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [backdrop, setBackdrop] = useState([]);
    const [backdropIndex, setBackdropIndex] = useState(0);
    const [poster, setPoster] = useState([]);
    const [posterIndex, setPosterIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSeason() {
            try {
                setLoading(true);
                setError("");
            
                // 1) Show-level data (title, creators, rating, backdrop, etc.)
                const data = await getTvDetails(id);
            
                // 2) Season-level data (season number, poster, overview, episodes, etc.)
                const seasonData = await getTvSeasonDetails(id, seasonNumber);
            
                // --- certification (US rating) from SHOW ---
                let certification = "";
                if (data.content_ratings?.results) {
                    const us = data.content_ratings.results.find((r) => r.iso_3166_1 === "US");
                    if (us?.rating) certification = us.rating;
                }
            
                let creators = [];
                if (data.created_by?.length) {
                    creators = data.created_by.map((person) => ({
                    id: person.id,
                    name: person.name,
                    }));
                }
            
                const images = await getTvImages(id);

                const backdropList = images.backdrops || [];
                const posterList = images.posters || [];

                setBackdrop(backdropList);
                setBackdropIndex(0);
            
                // if current poster path exists, prepend tmdb's image base url. otherwise return null
                const currentPosterUrl = seasonData.poster_path
                    ? `https://image.tmdb.org/t/p/original${seasonData.poster_path}`
                    : null;
                // accesses one backdrop object from the array, if the backdrop exists get its file_path otherwise return null
                const currentBackdropPath = backdropList[backdropIndex]?.file_path || null;
                // if current poster path exists, prepend tmdb's image base url. otherwise return null
                const currentBackdropUrl = currentBackdropPath
                    ? `https://image.tmdb.org/t/p/original${currentBackdropPath}`
                    : null;
            
                const tvSeasonData = {
                    title: data.name,
                    number: seasonData.season_number,
                    poster: currentPosterUrl,
                    backdrop: currentBackdropUrl,
                    year: data.first_air_date ? data.first_air_date.slice(0, 4) : "Release Data Unavailable",
                    rating: certification,            
                    tagline: data.tagline || "No Tagline Available",   
                    summary: seasonData.overview || data.overview || "No Overview Available",
                    creators,
                };
            
                setSeason(tvSeasonData);
                setSelectedSeason(String(seasonData.season_number)); // keeps dropdown synced
                console.log("TV Season Object Data: ", tvSeasonData);
            } 
            catch (err) {
                console.error(err);
                setError("Failed to load season.");
            } finally {
                setLoading(false); // stop loading
            }
        }
        loadSeason();
    }, [id, seasonNumber]);

    return(
        <>
            <div className="backdrop-container" style={{
                    backgroundImage: season?.backdrop ? `url(${season.backdrop})` : "none",
                    }}>
                <div className="movie-app">
                    <SearchBar />

                    {loading && <p>Loading…</p>}
                    {error && <p>{error}</p>}

                    {!loading && !error && season && (
                        <>
                            <div className="tv-basic">
                                <div className="tv-left">
                                    {/* poster element */}
                                    {season.poster ? (
                                        <img
                                            src={season.poster}
                                            alt={`${season.title} poster`}
                                            className="tv-poster"
                                        />
                                    ) : (
                                        <p>No Poster Available</p>
                                    )}
                                </div>
                                <div className="tv-info">
                                    <h1>{season.title}</h1>
                                    <h3>
                                        {/* only render the year if it exists */}
                                        {season.year && <span><u>{season.year}</u></span>}
                                        {/* only show the bullet if both year and creator exist */}
                                        {season.year && season.creators && <span> • </span>}
                                        {/* renders the creators text */}
                                        {season.creators && (
                                            <span>
                                                Created By{" "}
                                                {season.creators.map((creator, index) => (
                                                    <span key={creator.id}>
                                                        <u
                                                            className="tv-creator"
                                                            onClick={() => navigate(`/person/${creator.id}?job=Creator&media=tv`)}
                                                        >
                                                            {creator.name}
                                                        </u>
                                                        {index < season.creators.length - 1 && ", "}
                                                    </span>
                                                ))}
                                            </span>
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default TvSeasonPage