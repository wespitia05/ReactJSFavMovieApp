// this function will handle returning the list of episodes 
// when visiting a season page
function EpisodeList({ episodes = [] }) {
    // if nothing exists, render nothing
    if (episodes.length === 0) {
        return null;
    }

    return(
        <div className="episode-list">
            {episodes.map((episode) => (
                <div key={episode.id} className="episode-item">
                    <span className="episode-number">
                        {episode.episode_number}
                    </span>
                    <span className="episode-title">
                        {" "}{episode.name}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default EpisodeList;