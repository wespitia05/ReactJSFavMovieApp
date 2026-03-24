function Details({studios = [], countries = [], languages = []}) {
    // if nothing exists, render nothing
    if (studios.length === 0 && countries.length === 0 && languages.length === 0) {
        return null;
    }

    return(
        <div className="details">
            <div className="details-row">
                <span className="details-label">Studios</span>
                <span className="details-value">
                    {studios.length > 0 ? studios.join(", ") : "Unknown"}
                </span>
            </div>
            <div className="details-row">
                <span className="details-label">Countries</span>
                <span className="details-value">
                    {countries.length > 0 ? countries.join(", ") : "Unknown"}
                </span>
            </div>
            <div className="details-row">
                <span className="details-label">Languages</span>
                <span className="details-value">
                    {languages.length > 0 ? languages.join(", ") : "Unknown"}
                </span>
            </div>
        </div>
    );
}

export default Details;