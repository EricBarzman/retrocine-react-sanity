import { useEffect } from "react";
import MovieCard from "../Movies/MovieCard/MovieCard";
import { useDispatch, useSelector } from "react-redux";

function My_Favorites() {

    const dispatch = useDispatch();

    const myFavorites = useSelector((state) => state.favorites.my_favorites);

    useEffect(() => {
      dispatch({ type: 'FETCH_FAVORITES' });
    }, [dispatch, myFavorites])

    return (
    <main className="text-white px-10 py-4">
      
      <h2 className="text-3xl font-semibold mb-6">My favorites</h2>
      
      <section className="flex flex-row flex-wrap mt-12">
        {myFavorites.length > 0 && myFavorites.map((favorite) => (
          <MovieCard key={favorite.movie._id} movie={favorite.movie} />
        ))}
        {myFavorites.length == 0 && (
          <p className="h-screen">You have no favorites yet!</p>
        )}
      </section>

    </main>
  )
}

export default My_Favorites