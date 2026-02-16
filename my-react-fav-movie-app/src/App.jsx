import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MoviePage from "./pages/MoviePage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import PersonPage from "./pages/PersonPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/movie/:id" element={<MoviePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/person/:id" element={<PersonPage />} />
            </Routes>
        </BrowserRouter>
    );    
}

export default App