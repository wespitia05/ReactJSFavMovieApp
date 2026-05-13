import { useNavigate } from "react-router-dom";

// this function will handle returning details on a movie or tv show
// will display the studio, country and language information
function Details({studios = [], countries = [], languages = [], primaryLanguage = "", mediaType = "movie"}) {
    // this constant we will use to navigate from one page to the next
    const navigate = useNavigate();

    // if nothing exists, render nothing
    if (studios.length === 0 && countries.length === 0 && languages.length === 0) {
        return null;
    }

    // console.log("DETAILS PROPS:", { studios, countries, languages, primaryLanguage });

    return(
        <div className="details">
            <div className="details-row">
                <span className="details-label">Studios: </span>
                <span className="details-value">
                    {studios.length > 0 ? (
                        studios.map((studio, index) => (
                            <span
                                key={`${studio.id || studio.name}-${index}`}
                                className="details-item"
                                onClick={() =>
                                    navigate(
                                        `/browse/studio/${studio.id}?name=${encodeURIComponent(studio.name)}`,
                                        {
                                            state: {
                                                mediaType: mediaType
                                            }
                                        }
                                    )
                                }
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
                            <span
                                key={`${country.code || country.name}-${index}`}
                                className="details-item"
                                onClick={() =>
                                    navigate(`/browse/country/${country.code}`, {
                                        state: { name: country.name }
                                    })
                                }
                            >
                                {country.name}
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
                <span className="details-value">
                {primaryLanguage ? (
                    <span
                        className="details-item"
                        onClick={() =>
                            navigate(`/browse/language/${primaryLanguage.code}`, {
                                state: {
                                    name: primaryLanguage.name,
                                    source: "primary"
                                }
                            })
                        }
                    >
                        {primaryLanguage.name}
                    </span>
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
                            <span
                                key={`${language.code || language.name}-${index}`}
                                className="details-item"
                                onClick={() =>
                                    navigate(`/browse/language/${language.code}`, {
                                        state: { name: language.name, source: "spoken" }
                                    })
                                }
                            >
                                {language.name}
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