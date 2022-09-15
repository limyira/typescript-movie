import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Movie from "./Routes/Movie";
import Popular from "./Routes/Popular";
import NowPlaying from "./Routes/Nowplaying";
import TopTv from "./Routes/Top";
import PopularTv from "./Routes/PopularTv";
// import TvSearch from "./Routes/TvSearch";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="movie/popular/:movieId" element={<Popular />} />
          <Route path="movie/nowplaying/:movieId" element={<NowPlaying />} />
        </Route>
        <Route path="/tv" element={<Tv />}>
          <Route path="top/:tvId" element={<TopTv />} />
          <Route path="popular/:tvId" element={<PopularTv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/:id" element={<Search />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
