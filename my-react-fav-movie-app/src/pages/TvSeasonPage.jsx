import { useParams } from "react-router-dom";
import { getTvDetails, getTvImages, getTvSeasonDetails, getTvSeasonCredits, getTvKeywords } from "../api/tmdb";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import CastList from "../components/CastList";
import CrewList from "../components/CrewList";
import { useNavigate } from "react-router-dom";
import EpisodeList from "../components/EpisodeList";

function TvSeasonPage() {
    // gets the tv show id and season number from the url
    const {id, seasonNumber} = useParams();
    const navigate = useNavigate();

    const [season, setSeason] = useState(null);
    const [tv, setTv] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [backdrop, setBackdrop] = useState([]);
    const [backdropIndex, setBackdropIndex] = useState(0);
    const [poster, setPoster] = useState([]);
    const [posterIndex, setPosterIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("cast");

    useEffect(() => {
        async function loadSeason() {
            try {
                setLoading(true);
                setError("");
            
                // 1) Show-level data (title, creators, rating, backdrop, etc.)
                const data = await getTvDetails(id);
            
                // 2) Season-level data (season number, poster, overview, episodes, etc.)
                const seasonData = await getTvSeasonDetails(id, seasonNumber);

                // 3) Season-level credits
                const credits = await getTvSeasonCredits(id, seasonNumber);

                // season cast and crew is saved a bit differently
                // these two constants basically loop through more cast and crew members,
                // returning the cast name and their character, and the crew name and job title
                const seasonCast = (credits.cast || []).map((person) => ({
                    id: person.id,
                    name: person.name,
                    character: person.roles?.[0]?.character || "",
                }));
                const seasonCrew = (credits.crew || []).flatMap((person) =>
                    (person.jobs || []).map((j) => ({
                        id: person.id,
                        name: person.name,
                        job: j.job,
                    }))
                );
            
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

                // awaits api call to retrieve keywords object
                const keywordData = await getTvKeywords(id);
                // returns list of keywords
                const keywordList = keywordData.results ? keywordData.results.map((keyword) => keyword.name) : [];
            
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
                    episodes: seasonData.episodes?.length || 0,
                    genres: data.genres ? data.genres.map((genre) => genre.name) : [],
                    seasonList: data.seasons || [],
                    cast: seasonCast, 
                    crew: seasonCrew,
                    // pull tv season episode list
                    episodes: seasonData.episodes || [],
                    // pulls keywords from selected movie
                    keywords: keywordList
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
                                    {season?.seasonList?.length > 0 && (
                                        <div className="season-select-container">
                                            <select className="season-select" value={selectedSeason} 
                                                onChange={(e) => {
                                                    const seasonNumber = e.target.value;
                                                    if (seasonNumber === "overall") {
                                                        navigate(`/tv/${id}`);
                                                        return;
                                                    }
                                                    setSelectedSeason(seasonNumber);
                                                  
                                                    if (seasonNumber) {
                                                      navigate(`/tv/${id}/season/${seasonNumber}`);
                                                    }
                                                }}
                                            >
                                            <option value="overall">Overall Show</option>
                                            {season.seasonList
                                                // optional: remove specials (Season 0) if you want
                                                .filter((s) => s.season_number !== 0)
                                                .map((season) => (
                                                <option key={season.id} value={season.season_number}>
                                                    Season {season.season_number}
                                                    {season.name && season.name !== `Season ${season.season_number}`
                                                    ? ` — ${season.name}`
                                                    : ""}
                                                </option>
                                            ))}
                                            </select>
                                        </div>
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
                                    <p>
                                        {season.number !== undefined && <span>Season {season.number} • </span>}
                                        {season.number !== undefined && season.episodes > 0 && <span> • </span>}
                                        {season.episodes > 0 && <span>{season.episodes} Episodes</span>}
                                        {season.number !== undefined && season.episodes > 0 && season.rating && <span> • </span>}
                                        {season.rating && <span className="tv-rating">{season.rating}</span>}
                                    </p>
                                    <p>
                                        {season?.genres?.length > 0 && (
                                            <span>{season.genres.join(", ")}</span>
                                        )}
                                    </p>
                                    <h3><i>{season.tagline}</i></h3>
                                    <h3>{season.summary}</h3>
                                    <div className="tv-tabs">
                                        {/* these tab buttons control what is currently being displayed */}
                                        <button
                                            className={`tv-tab ${activeTab === "cast" ? "active" : ""}`}
                                            onClick={() => setActiveTab("cast")}
                                            type="button">Cast</button>
                                        <button
                                            className={`tv-tab ${activeTab === "crew" ? "active" : ""}`}
                                            onClick={() => setActiveTab("crew")}
                                            type="button">Crew</button>
                                        <button
                                            className={`tv-tab ${activeTab === "episodes" ? "active" : ""}`}
                                            onClick={() => setActiveTab("episodes")}
                                            type="button">Episodes</button>
                                        <button
                                            className={`tv-tab ${activeTab === "genres" ? "active" : ""}`}
                                            onClick={() => setActiveTab("genres")}
                                            type="button">Genres</button>

                                        <button
                                            className={`tv-tab ${activeTab === "releases" ? "active" : ""}`}
                                            onClick={() => setActiveTab("releases")}
                                            type="button">Releases</button>
                                    </div>
                                    {/* this will determine what content is being displayed when the tab is active */}
                                    <div className="tv-tab-content">
                                        {activeTab === "cast" && <CastList cast={season.cast} media="tv"/>}
                                        {activeTab === "crew" && <CrewList crew={season.crew} media="tv"/>}
                                        {activeTab === "episodes" && <EpisodeList episodes={season.episodes}/>}
                                        {activeTab === "genres" && <Genres genres={season.genres} keywords={season.keywords}/>}
                                        {activeTab === "releases" && <p>Coming next: release dates + certifications</p>}
                                    </div>
                                </div>
                                <div className="movie-modal">
                                    <div className="movie-modal-content">
                                        <ul>
                                            <li>Rating: ⭐️⭐️⭐️⭐️⭐️</li>
                                            <hr />
                                            <li>Change Poster</li>
                                            <hr />
                                            <li>Change Backdrop</li>
                                            <hr />
                                            <li>Streaming</li>
                                        </ul>
                                    </div>
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