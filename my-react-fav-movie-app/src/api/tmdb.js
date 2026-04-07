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
    // "?" starts the query parameters
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
    // return the parsed json to whoever calls getImages
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
    // return the parsed json to whoever calls getActorDetails
    return data;
}

// async so we can use await and returns an object
// our parameter is actorId which is what we use to get information on the actor that was selected
async function getPersonCredits(personId) {
    // build our full request url
    // ${base_url}/person/${actorId}/movie_credits is the endpoint that searches across movies actors have been in
    // ? starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/person/${personId}/combined_credits?language=en-US&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB actor credits failed");
    }

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getPersonCredits
    return data;
}

// async so we can use await and returns an object
// our parameter is tvId which is what we use to get info on the tv show selected
async function getTvDetails(tvId) {
    // build our full request url
    // ${base_url}/tv/${tvId} is the endpoint that searches across tv shows
    // "?" starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/tv/${tvId}?` +
    `language=en-US&append_to_response=credits,content_ratings,aggregate_credits&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB TV details failed")
    };

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getTvDetails
    return data;
}

// async so we can use await and returns an object
// our parameter is tvId which is what we use to get the backdrop on the tv show selected
async function getTvImages(tvId) {
    // build our full request url
    // ${base_url}/tv/${tvId}/images is the endpoint that searches across tv show images
    // "?" starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/tv/${tvId}/images?` +
    `include_image_language=en,null&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB tv backdrop images failed");
    }

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getTvImages
    return data;
}

// async so we can use await and returns an object
// our parameter is tvId which is what we use to get info on the tv show selected
async function getTvSeasonDetails(tvId, seasonNumber) {
    // build our full request url
    // ${base_url}/tv/${tvId}/season/{seasonNumber} is the endpoint that searches across tv show seasons
    // "?" starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/tv/${tvId}/season/${seasonNumber}?` +
    `language=en-US&append_to_response=credits,content_ratings,aggregate_credits&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB TV season details failed")
    };

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getTvSeasonDetails
    return data;
}

// async so we can use await and returns an object
// our parameter is tvId and seaosnNumber which is what we use to get the credits on the tv show season selected
async function getTvSeasonCredits(tvId, seasonNumber) {
    // build our full request url
    // ${base_url}/tv/${tvId}/season/{seasonNumber}/credits is the endpoint that searches across tv show seasons
    // "?" starts the query parameters
    // language=en-US returns english text
    const url = `${base_url}/tv/${tvId}/season/${seasonNumber}/aggregate_credits?` +
    `language=en-US&api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB TV season credits failed")
    };

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getTvSeasonCredits
    return data;
}

// async so we can use await and returns an object
// our parameter is movieId which is what we use to get info on the movie selected
async function getMovieKeywords(movieId) {
    // build our full request url
    // ${base_url}/movie/${movieId} is the endpoint that searches across movies
    // "?" starts the query parameters
    const url = `${base_url}/movie/${movieId}/keywords?api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB movie keywords failed")
    };

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getMovieKeywords
    return data;
}

// async so we can use await and returns an object
// our parameter is tvId which is what we use to get info on the tv show selected
async function getTvKeywords(tvId) {
    // build our full request url
    // ${base_url}/movie/${movieId} is the endpoint that searches across movies
    // "?" starts the query parameters
    const url = `${base_url}/tv/${tvId}/keywords?api_key=${api}`;

    // res is our response object, sends an http request to the tmdb
    // await pauses until the response comes back
    const res = await fetch(url);

    // res.ok is true for status codes 200-299
    // if res.ok is not true...
    if (!res.ok) {
        // if tmdb returns 401, 404, etc, we throw an error
        throw new Error("TMDB tv keywords failed")
    };

    // converts the response body into a json, data becomes the parsed json
    const data = await res.json();
    // return the parsed json to whoever calls getTvKeywords
    return data;
}

// async so we can use await and returns an object
// our parameter is year which is what we use to get info on the movies released that year
async function getMoviesByYear(year, sortBy = "popularity.desc", startPage = 1) {
    let allMovies = [];
    let totalResults = 0;
    let totalPages = 1;

    // only fetch the first 3 pages worth of movies
    for (let page = startPage; page <= startPage + 3; page++) {
        const url = `${base_url}/discover/movie?primary_release_year=${year}&include_adult=false&language=en-US&page=${page}&sort_by=${sortBy}&vote_count.gte=50&page=${page}&api_key=${api}`;

        // res is our response object, sends an http request to the tmdb
        // await pauses until the response comes back
        const res = await fetch(url);

        // res.ok is true for status codes 200-299
        // if res.ok is not true...
        if (!res.ok) {
            // if tmdb returns 401, 404, etc, we throw an error
            throw new Error("TMDB movies by year failed")
        };

        // converts the response body into a json, data becomes the parsed json
        const data = await res.json();

        if (page === startPage) {
            // return number of movies released in that year
            totalResults = data.total_results || 0;
            totalPages = data.total_pages || 1;
        }

        allMovies = [...allMovies, ...(data.results || [])];

        // stop if we reach the last tmdb page
        if (page >= totalPages) {
            break;
        }
    }

    // return the parsed json to whoever calls getMovieByYear
    return {
        movies: allMovies.slice(0, 50),
        totalResults, totalPages
    };
}

// async so we can use await and returns an object
// our parameter is studioId which is what we use to get info on the movies released by that studio
async function getMoviesByStudio(studioId, sortBy = "popularity.desc", startPage = 1) {
    let allMovies = [];
    let totalResults = 0;
    let totalPages = 1;

    // only fetch the first 3 pages worth of movies
    for (let page = startPage; page <= startPage + 3; page++) {
        const url = `${base_url}/discover/movie?with_companies=${studioId}&include_adult=false&language=en-US&page=${page}&sort_by=${sortBy}&vote_count.gte=50&page=${page}&api_key=${api}`;

        // res is our response object, sends an http request to the tmdb
        // await pauses until the response comes back
        const res = await fetch(url);

        // res.ok is true for status codes 200-299
        // if res.ok is not true...
        if (!res.ok) {
            // if tmdb returns 401, 404, etc, we throw an error
            throw new Error("TMDB movies by studio failed")
        };

        // converts the response body into a json, data becomes the parsed json
        const data = await res.json();

        if (page === startPage) {
            // return number of movies released in that year
            totalResults = data.total_results || 0;
            totalPages = data.total_pages || 1;
        }

        allMovies = [...allMovies, ...(data.results || [])];

        // stop if we reach the last tmdb page
        if (page >= totalPages) {
            break;
        }
    }

    // return the parsed json to whoever calls getMovieByYear
    return {
        movies: allMovies.slice(0, 50),
        totalResults, totalPages
    };
}

// async so we can use await and returns an object
// our parameter is countryCode which is what we use to get info on the movies released by that country
async function getMoviesByCountry(countryCode, sortBy = "popularity.desc", startPage = 1) {
    let allMovies = [];
    let totalResults = 0;
    let totalPages = 1;

    // only fetch the first 3 pages worth of movies
    for (let page = startPage; page <= startPage + 3; page++) {
        const url = `${base_url}/discover/movie?with_origin_country=${countryCode}&include_adult=false&language=en-US&page=${page}&sort_by=${sortBy}&vote_count.gte=50&page=${page}&api_key=${api}`;

        // res is our response object, sends an http request to the tmdb
        // await pauses until the response comes back
        const res = await fetch(url);

        // res.ok is true for status codes 200-299
        // if res.ok is not true...
        if (!res.ok) {
            // if tmdb returns 401, 404, etc, we throw an error
            throw new Error("TMDB movies by country failed")
        };

        // converts the response body into a json, data becomes the parsed json
        const data = await res.json();

        if (page === startPage) {
            // return number of movies released in that year
            totalResults = data.total_results || 0;
            totalPages = data.total_pages || 1;
        }

        allMovies = [...allMovies, ...(data.results || [])];

        // stop if we reach the last tmdb page
        if (page >= totalPages) {
            break;
        }
    }

    // return the parsed json to whoever calls getMovieByYear
    return {
        movies: allMovies.slice(0, 50),
        totalResults, totalPages
    };
}

// exports function for other files to import
export {searchMulti, getMovieDetails, getImages, getActorDetails, getPersonCredits, 
        getTvDetails, getTvImages, getTvSeasonDetails, getTvSeasonCredits, getMovieKeywords, 
        getTvKeywords, getMoviesByYear, getMoviesByStudio, getMoviesByCountry}