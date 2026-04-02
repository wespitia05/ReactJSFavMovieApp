import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MoviePage from "./pages/MoviePage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import PersonPage from "./pages/PersonPage.jsx";
import TvPage from "./pages/TvPage.jsx";
import TvSeasonPage from "./pages/TvSeasonPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/movie/:id" element={<MoviePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/person/:id" element={<PersonPage />} />
                <Route path="/tv/:id" element={<TvPage />} />
                <Route path="/tv/:id/season/:seasonNumber" element={<TvSeasonPage />} />
                <Route path="/browse/:type/:value" element={<BrowsePage />} />
            </Routes>
        </BrowserRouter>
    );    
}

export default App