// safer way to import our api key from the .env file
const api = import.meta.env.VITE_API_KEY;
// base url for all tmdb api endpoints
const base_url = "https://api.themoviedb.org/3";

// async so we can use await and returns an object
// our parameter is query which is what the user types
async function searchMulti(query) {
    // build our full request url
    // ${base_url}/search/multi is the endpoint that searches across movies, tv and people
    // ? starts the query parameters
    // encodeURIComponent(quer) makes the search safe for urls
    // include_adult=false filters out adult content
    // language=en-US returns english text
    // page=1 requests the first page of results
    const url =
    `${base_url}/search/multi?` +
    `query=${encodeURIComponent(query)}` +
    `&include_adult=false&language=en-US&page=1&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDb search failed");
    }

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls searchMulti
    return data;
}

// async so we can use await and returns an object
// our parameter is movieId which is what we use to get info on the movie selected
async function getMovieDetails(movieId) {
    // build our full request url
    // ${base_url}/movie/${movieId} is the endpoint that searches across movies
    // ? starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/movie/${movieId}?` +
    `language=en-US&append_to_response=credits,release_dates&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB movie details failed")
    };

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getMovieDetails
    return data;
}

// async so we can use await and returns an object
// our parameter is movieId which is what we use to get the backdrop on the movie selected
async function getImages(movieId) {
    // build our full request url
    // ${base_url}/movie/${movieId}/images is the endpoint that searches across movie images
    // ? starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/movie/${movieId}/images?` +
    `include_image_language=en,null&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB backdrop images failed");
    }

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getMovieDetails
    return data;
}

// async so we can use await and returns an object
// our parameter is actorId which is what we use to get information on the actor that was selected
async function getActorDetails(actorId) {
    // build our full request url
    // ${base_url}/person/${actorId} is the endpoint that searches across people
    // ? starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/person/${actorId}?language=en-US&api_key=${api}`;
    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB actor details failed");
    }

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getMovieDetails
    return data;
}

// async so we can use await and returns an object
// our parameter is actorId which is what we use to get information on the actor that was selected
async function getActorMovies(actorId) {
    // build our full request url
    // ${base_url}/person/${actorId}/movie_credits is the endpoint that searches across movies actors have been in
    // ? starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/person/${actorId}/movie_credits?language=en-US&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB actor details failed");
    }

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getMovieDetails
    return data;
}

// exports function for other files to import
export {searchMulti, getMovieDetails, getImages, getActorDetails, getActorMovies}