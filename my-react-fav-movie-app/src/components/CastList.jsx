import { use } from "react";
import { useNavigate } from "react-router-dom";

// this function will handle returning the list of cast members
function CastList({cast = []}) {
    // will be used to navigate to another page
    const navigate = useNavigate();
    // only show first 20 cast members
    const topCast = cast.slice(0, 20);

    // if no cast exists, return null
    if (topCast.length === 0) {
        return null;
    }

    return(
        <div className="cast">
            <ul className="cast-list">
                {topCast.map((person) => (
                    <li key={person.id} className="cast-item">
                        <span className="cast-name" onClick={() => navigate(`/person/${person.id}`)}>{person.name}</span>
                        {person.character && (
                        <span className="cast-character"> as {person.character}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CastList