import { useParams } from "react-router-dom";

function TvSeasonPage() {
    const {id, seasonNumber} = useParams();
    
    return(
        <>
            <p>TV Show ID: {id}</p>
            <p>Season: {seasonNumber}</p>
        </>
    );
}

export default TvSeasonPage