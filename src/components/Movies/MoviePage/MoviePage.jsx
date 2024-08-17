import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";

import CommentCard from "./CommentCard";
import RateMovieModal from "./RateMovieModal";
import BackDrop from "./BackDrop";
import MovieVideo from "../MovieVideo/MovieVideo";

import {
  getMovieBySlug,
  createUserFavorite,
  getUserFavorites,
  deleteUserFavorite
} from "@/lib/apis";

// Define how a movie object looks like
const defaultMovie = {
  title: "",
  year: "",
  country: "",
  director: {
    first_name: "",
    last_name: "",
  },
  genre: {
    label: "",
  },
  keywords: [],
};

function MoviePage() {

  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isRateMovieModalOpen, setIsRateMovieModalOpen] = useState(false);
  const [favoriteId, setFavoriteId] = useState('');
  
  const { sanityUserId } = useSelector((state) => state.user);
  const myFavorites = useSelector((state) => state.favorites.my_favorites);

  // Get the slug to recover the movie
  let movie_slug = useParams().movie_slug;
  const [movie, setMovie] = useState(defaultMovie);

  // Get the movie info, check if favorite, and if already voted for
  useEffect(() => {
    getMovieBySlug(movie_slug).then((response) => setMovie(response));

    document.title = `${movie.title} | Retrocine`;
    
    const foundFavorite = myFavorites.find((favorite) => favorite.movie._id === movie._id);
    if (foundFavorite) {
        setFavoriteId(foundFavorite._id);
        setIsFavorite(true);
    }
  }, [myFavorites]);


  function addToMyFavorites() {
    createUserFavorite(sanityUserId, movie._id)
      .then(() => {
        toast.success("Added to my favorites");
        setIsFavorite(true);
        dispatch({ type: "FETCH_FAVORITES" });
      })
      .catch(() => {
        toast.error("Could not add to favorites");
      });
  }

  async function removeFromMyFavorites() {
    try {
      await deleteUserFavorite(favoriteId);
      toast.success("Removed from my favorites");
      dispatch({ type: "FETCH_FAVORITES" });
      // Little cheat to display card no longer as favorite, yet without rerendering
      setFavoriteId('');
      setIsFavorite(false);
    } catch (error) {
      toast.error("Could not remove from favorites");
    }
  }

  return (
    <main className="text-white ml-20 py-10 mx-auto">
      <h2 className="text-3xl font-semibold mb-6">{movie.title}</h2>

      {/* Trailer */}
      <MovieVideo youtube_id={movie.youtube_id} />

      <section className="mb-6">
        <div className="mt-10 ml-5 mb-10">
          <div className="flex items-end mb-4">
            {/* Add to favorites */}
            <div className="mb-6 text-xl">
              {!isFavorite && (
                <button onClick={addToMyFavorites} id={movie.id}>
                  <MdFavoriteBorder />
                </button>
              )}
              {isFavorite && (
                <button onClick={removeFromMyFavorites} id={movie.id}>
                  <MdFavorite className="fill-primary" />
                </button>
              )}
            </div>

            {/* Vote for movie */}
            <div className="ml-10 mb-4">
              <button
                className="mt-4 rounded-xl px-4 py-2 bg-primary border-2 border-black text-white hover:bg-green-400 transition-all"
                onClick={() => setIsRateMovieModalOpen(true)}
              >
                Rate movie
              </button>
            </div>
          </div>

          {/* Information */}
          <div>
            <p className="text-sm mb-3">
              <span className="text-gray-500">Directed by:</span>{" "}
              {movie.director.first_name} {movie.director.last_name}
            </p>
            <p className="text-sm mb-3">
              <span className="text-gray-500">Genre:</span> {movie.genre.label}
            </p>
            <p className="text-sm mb-3">
              <span className="text-gray-500">Country:</span>{" "}
              {movie.country.name}
            </p>
            <p className="text-sm mb-3">
              <span className="text-gray-500">Year:</span> {movie.year}
            </p>
          </div>
        </div>

        <div className="p-10">
          <p className="text-gray-400 underline mb-3">Summary</p>
          <p>{movie.short_description}</p>
        </div>

        {/* <div className="pl-10 mt-6 mb-10">
                <div className="text-gray-500 text-sm mb-3">Keywords</div>
                {movie.keywords.map(keyword => (
                    <div className="text-sm" key={keyword.id}>{keyword.label}</div>
                ))}
            
            </div> */}

        {/* Reviews */}
        {movie.votes && (
          <div className="pl-10 mt-10 w-1/3">
            <h2 className="text-gray-400 mb-3">Ratings</h2>

            {movie.votes.slice(0, 3).map((vote) => (
              <CommentCard key={vote.id} vote={vote} />
            ))}
          </div>
        )}
      </section>

      {/* RATE MOVIE MODAL */}
      <RateMovieModal
        movie={movie}
        isRateMovieModalOpen={isRateMovieModalOpen}
        setIsRateMovieModalOpen={setIsRateMovieModalOpen}
      />
      <BackDrop isRateMovieModalOpen={isRateMovieModalOpen} />
    </main>
  );
}

export default MoviePage;
