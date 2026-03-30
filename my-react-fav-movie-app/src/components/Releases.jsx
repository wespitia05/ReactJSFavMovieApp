// this function will handle returning release info on the
// movie that is selected.
// will display different types of releases such as:
//      theatrical, physical, premiere, tv, etc
function Releases({ releases = {} }) {
    // array of release order by date
    const releaseOrder = [
        "Premiere",
        "Theatrical Limited",
        "Theatrical",
        "Digital",
        "Physical",
        "TV"
    ]

    // get all the release section names (premiere, theatrical, etc)
    const releaseTypes = releaseOrder.filter(type => releases[type]);

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
        <div className="releases">
            {releaseTypes.map((type) => {
                const groupedByDate = {};

                [...releases[type]]
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .forEach((release) => {
                        const dateKey = release.date;

                        if (!groupedByDate[dateKey]) {
                            groupedByDate[dateKey] = [];
                        }

                        groupedByDate[dateKey].push(release);
                    });

                const groupedRows = Object.entries(groupedByDate);

                return (
                    <div key={type} className="release-section">
                        <h3 className="release-heading">{type}</h3>

                        {groupedRows.map(([date, entries]) => (
                            <div key={`${type}-${date}`} className="release-row">
                                <span className="release-date">
                                    {formatDate(date)}
                                </span>

                                <span className="release-entries">
                                    {entries.map((release, index) => (
                                        <span
                                            key={`${release.country}-${release.rating}-${index}`}
                                            className="release-entry"
                                        >
                                            <span className="release-country">
                                                {getFlagEmoji(release.country)}{" "}
                                                {getCountryName(release.country)}{" "}
                                                {release.rating && (
                                                    <span className="release-rating">
                                                        {release.rating}
                                                    </span>
                                                )}
                                            </span>

                                            {type === "Premiere" && release.city && (
                                                <span className="release-city">
                                                    {release.city}
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default Releases;