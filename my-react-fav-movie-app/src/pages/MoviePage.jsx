import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { getMovieDetails } from "../api/tmdb";

function MoviePage() {
    const {id} = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadMovie() {
            try {
                setLoading(true);
                setError("");

                const data = await getMovieDetails(id);
                setMovie(data);

                console.log("Movie stored in state: ", data);
            }
            catch (err) {
                console.error(err);
                setMovie(null);
                setError("Failed to load movie.");
            }
            finally {
                setLoading(false);
            }
        }
        loadMovie();
    }, [id]);

    return (
        <div className="movie-app">
            <SearchBar />

            {loading && <p>Loading…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && movie && (
                <p style={{ marginTop: 16, opacity: 0.7 }}>
                Movie data loaded. Check console 
                </p>
            )}
        </div>
    );
}

export default MoviePage