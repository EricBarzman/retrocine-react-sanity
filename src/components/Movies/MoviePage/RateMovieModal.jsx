/* eslint-disable react/prop-types */
import { useState } from "react"
import toast from "react-hot-toast";
import { BsStarFill } from "react-icons/bs";
import { createUserVoteForMovie, getUserVoteForMovie } from "../../../lib/apis";
import { useSelector } from "react-redux";

export default function RateMovieModal({ movie, isRateMovieModalOpen, setIsRateMovieModalOpen }) {

    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const startValues = [1, 2, 3, 4, 5];

    const user = useSelector((state) => state.user)

    const toggleRatingModal = () => {
        setIsRateMovieModalOpen(!isRateMovieModalOpen);
        setRating(1);
        setComment('');
    };

    async function submitVote() {
        try {
            const vote = await getUserVoteForMovie({ userId : user.sanityUserId, movieId: movie._id });
            console.log("vote");
            console.log(vote);
            if (vote) {
                toast.error("You already rated this movie.")
                return 0
            } 
            await createUserVoteForMovie({ userId : user.sanityUserId, movieId: movie._id, rating, comment });
            toast.success('Vote sent!');

        } catch(error) {
            toast.error("Could not submit vote. Try again, please.")
            console.error(error)
        }
        toggleRatingModal();
    }

    return (
        <div className={`fixed z-[61] inset-0 flex items-center justify-center ${isRateMovieModalOpen
            ? 'opacity-100'
            :'opacity-0 pointer-events-none'
        }`}>
            <div className="bg-black shadow-white shadow-md w-96 p-5 rounded-lg">
                
                <h2 className="text-xl text-white font-semibold mb-4">
                    Rate the movie
                </h2>
                
                <label className="block text-sm font-medium text-white">
                    Rating
                </label>

                {/* 5 stars */}
                <div className="flex items-center mb-3">
                    {startValues.map(value => (
                        <button
                            key={value}
                            className={`w-6 h-6 ${value <= rating ? "text-primary" : "text-[#2B2073]"}`}
                            onClick={() => setRating(value)}
                        >
                            <BsStarFill/>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col mb-4">
                    <label className="text-white text-sm font-medium mb-2">
                        Write some comment:
                    </label>

                    <textarea
                        className="bg-black text-gray-400 border-2 border-gray-600"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* BUTTONS */}
                <div className="flex justify-center">
                    <button
                        onClick={submitVote}
                        type='submit'
                        className='rounded-lg px-4 py-2 bg-primary
                            text-white hover:bg-green-400 transition-all'
                    >
                        Submit
                    </button>

                    {/* Exit Modal */}
                    <button
                        onClick={toggleRatingModal}
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    )
}