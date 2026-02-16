import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function TvPage() {
    // get the tv id from the url (/tv/:id)
    const {id} = useParams();

    return(
        <>
            <div className="movie-app">
                <SearchBar />
                <p>TV Show ID: {id}</p>
            </div>
        </>
    );
}

export default TvPage