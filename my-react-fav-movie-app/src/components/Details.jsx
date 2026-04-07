import { useNavigate } from "react-router-dom";

// this function will handle returning details on a movie or tv show
// will display the studio, country and language information
function Details({studios = [], countries = [], languages = [], primaryLanguage = ""}) {
    // this constant we will use to navigate from one page to the next
    const navigate = useNavigate();

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
                        <span
                            key={studio.id}
                            className="details-item"
                            onClick={() => navigate(`/browse/studio/${studio.id}?name=${encodeURIComponent(studio.name)}`)}
                        >
                            {studio.name}
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
                <span className="details-label">Primary Language: </span>
                <span className="details-item">
                    {primaryLanguage || "Unknown"}
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