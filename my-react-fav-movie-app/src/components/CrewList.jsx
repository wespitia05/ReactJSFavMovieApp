// this function will return the crew member list
function CrewList({crew = []}) {
    // show only important roles
    const jobs = ["Director", "Producer", "Writer", "Casting", "Editor", "Screenplay", "Original Writer", 
                  "Cinematography", "Novel", "Executive Producer", "Original Music Composer",
                  "Costume Design", "Sound Designer", "Visual Effects Supervisor", "Visual Effects Producer",
                  "Lighting", "Production Design"];

    // log for debugging, prints jobs of all crew members              
    // console.log([...new Set(crew.map((p) => p.job))]);

    // filter through and only get the names of the crew members we want
    const filterJobs = crew.filter((person) => jobs.includes(person.job));

    // check if no crew members are available, if so return null
    if (filterJobs.length === 0) {
        return null;
    }

    return(
        <div className="crew">
            <ul className="crew-list">
                {filterJobs.map((person) => (
                    <li key={`${person.id}-${person.job}`} className="crew-items">
                        <span className="crew-job">{person.job}</span>
                        <span className="crew-name">{person.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CrewList