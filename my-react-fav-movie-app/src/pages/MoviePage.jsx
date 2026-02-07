import {useParams} from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";

function MoviePage() {
    const { id } = useParams();

    return (
        <div className="movie-app">
            <SearchBar />
            <h1>Movie Page</h1>
            <p>Movie ID: {id}</p>
        </div>
    );
}

export default MoviePage