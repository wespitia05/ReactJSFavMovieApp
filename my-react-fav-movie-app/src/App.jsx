import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MoviePage from "./pages/MoviePage.jsx";
import SearchResults from "./pages/SearchResults.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/movie/:id" element={<MoviePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/actor/:id" element={<ActorPage />} />
            </Routes>
        </BrowserRouter>
    );    
}

export default App