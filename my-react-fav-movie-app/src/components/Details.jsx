function Details({studios = [], countries = [], languages = []}) {
    // if nothing exists, render nothing
    if (studios.length === 0 && countries.length === 0 && languages.length === 0) {
        return null;
    }

    return(
        <div className="details">
            <div className="details-row">
                <span className="details-label">Studios: </span>
                <span className="details-value">
                    {studios.length > 0 ? (
                        studios.map((studio, index) => (
                        <span key={studio} className="details-item">
                            {studio}
                            {index < studios.length - 1 && ", "}
                        </span>
                        ))
                    ) : (
                        "Unknown"
                    )}
                </span>
            </div>
            <div className="details-row">
                <span className="details-label">Countries: </span>
                <span className="details-value">
                    {countries.length > 0 ? (
                        countries.map((country, index) => (
                        <span key={country} className="details-item">
                            {country}
                            {index < countries.length - 1 && ", "}
                        </span>
                        ))
                    ) : (
                        "Unknown"
                    )}
                </span>
            </div>
            <div className="details-row">
                <span className="details-label">Spoken Languages: </span>
                <span className="details-value">
                    {languages.length > 0 ? (
                        languages.map((language, index) => (
                        <span key={language} className="details-item">
                            {language}
                            {index < languages.length - 1 && ", "}
                        </span>
                        ))
                    ) : (
                        "Unknown"
                    )}
                </span>
            </div>
        </div>
    );
}

export default Details;