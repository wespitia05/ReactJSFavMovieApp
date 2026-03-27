// this function will handle returning the list of episodes 
// when visiting a season page
function EpisodeList({ episodes = [] }) {
    // if nothing exists, render nothing
    if (episodes.length === 0) {
        return null;
    }

    return(
        <div className="episode-list">
            {episodes.map((episode) => {
                const stillUrl = episode.still_path
                    ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                    : null;

                return (
                    <div key={episode.id} className="episode-item">
                        {stillUrl ? (
                            <img
                                src={stillUrl}
                                alt={`${episode.name} still`}
                                className="episode-still"
                            />
                        ) : (
                            <div className="episode-still-placeholder">
                                No Image
                            </div>
                        )}

                        <div className="episode-info">
                            <span className="episode-number">
                                {episode.episode_number}
                            </span>
                            <span className="episode-title">
                                {" "} {episode.name}
                            </span>
                            <span className="episode-rating">
                                {episode.vote_average.toFixed(1)}
                            </span>

                            <div className="episode-meta">
                                {episode.air_date && (
                                        <span>
                                            {new Date(episode.air_date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </span>
                                    )}
                                {episode.runtime && episode.air_date && <span> • </span>}
                                {episode.runtime && <span>{episode.runtime} min</span>}   
                            </div>

                            {episode.overview && (
                                <p className="episode-overview">
                                    {episode.overview}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default EpisodeList;