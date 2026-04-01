// this function will handle returning release info on the
// tv show that is selected.
// will display different types of releases such as:
//      air date (first & last), status, countries, networks, etc
function TvReleases({
    firstAirDate = "",
    lastAirDate = "",
    airDate = "",
    status = "",
    rating = "",
    episodeCount = 0,
    networks = [],
    countries = []
}) {
    // if nothing exists, render nothing
    if (
        !firstAirDate && !lastAirDate && !airDate && !status && !rating &&
        episodeCount === 0 && networks.length === 0 && countries.length === 0
    ) {
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
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        }).replace(",", "");
    }

    // helper function to get the country name from the country code
    function getCountryName(code) {
        // if no code exists, return unknown
        if (!code) {
            return "Unknown";
        }
        // create new constant that accepts the country code and returns the country name
        const region = new Intl.DisplayNames(["en"], { type: "region" });
        return region.of(code) || code;
    }

    // helper function to get the country emoji from the country code
    function getFlagEmoji(code) {
        if(!code) {
            return "";
        } 
        
        return code
            .toUpperCase()
            .split("")
            .map(char => 127397 + char.charCodeAt())
            .map(codePoint => String.fromCodePoint(codePoint))
            .join("");
    }

    return (
        <div className="tv-release">
            {firstAirDate && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">First Air Date:</span>
                    <span className="tv-release-value">
                        {formatDate(firstAirDate)}
                    </span>
                </div>
            )}
            {lastAirDate && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">Last Air Date:</span>
                    <span className="tv-release-value">
                        {formatDate(lastAirDate)}
                    </span>
                </div>
            )}
            {airDate && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">Air Date:</span>
                    <span className="tv-release-value">
                        {formatDate(airDate)}
                    </span>
                </div>
            )}
            {status && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">Show Status:</span>
                    <span className="tv-release-value">
                        {status}
                    </span>
                </div>
            )}
            {episodeCount > 0 && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">Episode Count:</span>
                    <span className="tv-release-value">
                        {episodeCount} Episode{episodeCount > 1 ? "s" : ""}
                    </span>
                </div>
            )}
            {networks.length > 0 && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">Networks:</span>
                    <span className="tv-release-value">
                        {networks.map((network, index) => (
                            <span key={network} className="tv-releases-item">
                                {network}
                                {index < networks.length - 1 && ", "}
                            </span>
                        ))}
                    </span>
                </div>
            )}
            {countries.length > 0 && (
                <div className="tv-release-row">
                    <span className="tv-release-heading">Countries/Rating:</span>
                    <span className="tv-release-value">
                        {countries.map((country, index) => (
                            <span key={country} className="tv-release-country-item">
                                {getFlagEmoji(country)}{" "}
                                {getCountryName(country)}{" "}
                                <span className="tv-release-rating">
                                    {rating}
                                </span>
                                {index < countries.length - 1 && ", "}
                            </span>
                        ))}
                    </span>
                </div>
            )}
        </div>
    );
}

export default TvReleases;