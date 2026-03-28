// this function will handle returning genres and themes
// on the movie selected
function Genres({ genres = [], keywords = []}) {
    // if nothing exists, render nothing
    if (genres.length === 0 && keywords.length === 0) {
        return null;
    }

    return (
        <div className="genres">
            {genres.length > 0 && (
                <div className="genres-list">
                    <span className="genres-label">Genres: </span>
                    <span className="genres-value">
                        {genres.map((genre, index) => (
                            <span key={genre} className="genre-item">
                                {genre}
                                {index < genres.length - 1 && ", "}
                            </span>
                        ))}
                    </span>
                </div>
            )}

            {keywords.length > 0 && (
                <div className="genres-list">
                    <span className="genres-label">Themes: </span>
                    <span className="genres-value">
                        {keywords.map((keyword, index) => (
                            <span key={keyword} className="genre-item">
                                {keyword}
                                {index < keywords.length - 1 && ", "}
                            </span>
                        ))}
                    </span>
                </div>    
            )}
        </div>
    );
}

export default Genres;