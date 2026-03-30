// this function will handle returning release info on the
// movie that is selected.
// will display different types of releases such as:
//      theatrical, physical, premiere, tv, etc
function Releases({ releases = {} }) {
    // get all the release section names (premiere, theatrical, etc)
    const releaseTypes = Object.keys(releases);

    // if nothing exists, render nothing
    if (releaseTypes.length === 0) {
        return null;
    }

    // helper function to format the date
    function formatDate(dateString) {
        // if date doesn't exist, return unknown
        if(!dateString) {
            return "Unknown";
        }
        // create new date constant
        const date = new Date(dateString);
        // return new date string order based on US style
        return date.toLocaleTimeString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    return (
        <div className="releases">
            {releaseTypes.map((type) => (
                <div key={type} className="release-section">
                    <h3 className="release-heading">{type}</h3>

                    {releases[type].map((release, index) => (
                        <div key={`${type}-${release.country}-${release.date}-${index}`} className="release-row">
                            <span className="release-date">
                                {formatDate(release.date)} {"• "}
                            </span>

                            <span className="release-country">
                                {release.country} {"• "}
                            </span>

                            <span className="release-rating">
                                {release.rating || "Unrated"}
                            </span>

                            {/* only show city for Premiere if a city exists */}
                            {type === "Premiere" && release.city && (
                                <span className="release-city">
                                    {release.city}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Releases;