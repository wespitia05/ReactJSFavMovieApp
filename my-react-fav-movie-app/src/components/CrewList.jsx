import { useNavigate } from "react-router-dom";

// this function will return the crew member list
function CrewList({crew = []}) {
    // show only important roles
    const jobs = ["Director", "Producer", "Executive Producer", "Writer", "Casting", "Editor", "Director of Photography", 
                  "Screenplay", "Original Writer", "Novel",  "Original Music Composer", "Costume Design", 
                  "Sound Designer", "Visual Effects Supervisor", "Visual Effects Producer", "Lighting", 
                  "Production Design"];
    // this constant we will use to navigate from one page to the next
    const navigate = useNavigate();

    // log for debugging, prints jobs of all crew members              
    // console.log([...new Set(crew.map((p) => p.job))]);

    // filter through and only get the names of the crew members we want
    const filterJobs = crew.filter((person) => jobs.includes(person.job));

    // set groupJobs equal to an empty object
    const groupJobs = {};

    // loop through the filtered crew and group them
    filterJobs.forEach((person) => {
        const job = person.job; // store the job in "job" variable

        // if the job doesn't exist yet in the object, create an empty array for it
        if (!groupJobs[job]) {
            groupJobs[job] = [];
        }

        // if the name is not already in the array for that job, add it
        if (!groupJobs[job].some((p) => p.id === person.id)) {
            groupJobs[job].push({
                id: person.id,
                name: person.name
            });
        }        
    });

    // turn object into an array we can map over, in the order of our jobs constant
    const rows = jobs
        .filter((job) => groupJobs[job]) // checks if the jobs exists in groupJobs, if not skip it
        .map((job) => [job, groupJobs[job]]); // converts each job into a row

    // log for debugging, displays the array of jobs being returned
    // console.log(rows);

    // check if no crew members are available, if so return null
    if (filterJobs.length === 0) {
        return null;
    }

    return(
        <div className="crew">
            <ul className="crew-list">
                {rows.map(([job, names]) => (
                    <li key={job} className="crew-item">
                        <span className="crew-job">{job}: </span>
                        <span className="crew-name">
                            {names.map((person, index) => (
                                <span
                                    key={person.id}
                                    className="crew-person"
                                    onClick={() =>
                                        navigate(`/person/${person.id}?job=${encodeURIComponent(job)}`)
                                    }
                                >
                                    {person.name}
                                    {index < names.length - 1 && ", "}
                                </span>
                            ))}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CrewList