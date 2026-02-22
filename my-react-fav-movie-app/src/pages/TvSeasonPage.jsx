import { useParams } from "react-router-dom";

function TvSeasonPage() {
    // gets the tv show id and season number from the url
    const {id, seasonNumber} = useParams();

    return(
        <>
            <p>TV Show ID: {id}</p>
            <p>Season: {seasonNumber}</p>
        </>
    );
}

export default TvSeasonPage