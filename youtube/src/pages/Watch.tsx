import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar.tsx";
import { useAppDispatch, useAppSelector } from "../stateStore/hooks.ts";
import { getRecommendedVideos } from "../stateStore/reducers/getRecommendedVideos.ts";
import { getVideoDetails } from "../stateStore/reducers/getVideoDetails.ts";
import { BiLike, BiDislike } from "react-icons/bi";
import { HiScissors } from "react-icons/hi";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import WatchCard from "../components/watchCard.tsx";

export default function Watch() {
  const [showMoreStatus, setShowMoreStatus] = useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentPlaying = useAppSelector(
    (state) => state.youtubeApp.currentVideo
  );
  const recommendedVideos = useAppSelector(
    (state) => state.youtubeApp.recommendedVideos || [] // Ensure it's always an array
  );

  useEffect(() => {
    if (id) {
      dispatch(getVideoDetails(id));
      setShowMoreStatus(false);
    } else {
      navigate("/");
    }
  }, [id, navigate, dispatch]);

  useEffect(() => {
    if (currentPlaying && id) {
      dispatch(getRecommendedVideos(id));
    }
  }, [currentPlaying, dispatch, id]);

  // Debugging: Log recommended videos
  console.log("recommendedVideos:", recommendedVideos);

  return (
    <>
      {currentPlaying && currentPlaying?.videoId === id && (
        <div className="max-h-screen overflow-hidden">
          <div style={{ height: "7.5vh" }}>
            <NavBar />
          </div>
          <div className="flex w-full" style={{ height: "92.5vh" }}>
            <div className="flex gap-y-10 gap-x-5 p-7 mx-20 mr-0 w-full overflow-auto">
              <div style={{ maxWidth: "800px" }}>
                <div>
                  <iframe
                    width="800"
                    height="502"
                    src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="mt-5">
                    <p className="text-xl">{currentPlaying.videoTitle}</p>
                    <div className="flex justify-between mt-1">
                      <div className="text-sm text-gray-400">
                        <span className="after:content-['•'] after:mx-1">
                          {currentPlaying.videoViews} views
                        </span>
                        <span> {currentPlaying.videoAge} ago</span>
                      </div>
                      <div className="flex items-center gap-4 uppercase">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <BiLike className="text-xl" />
                          <strong>{currentPlaying.videoLikes}</strong>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <BiDislike className="text-xl" />
                          <strong>dislike</strong>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <FaShare className="text-xl" />
                          <strong>share</strong>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <HiScissors className="text-xl" />
                          <strong>clip</strong>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <MdOutlinePlaylistAdd className="text-xl" />
                          <strong>save</strong>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <BsThreeDots className="text-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 flex-col border-solid border-gray-400 border-2 my-5 pb-3 border-l-transparent border-r-transparent">
                      <div className="flex items-center gap-5 mr-5 mt-4">
                        <div>
                          <img
                            src={currentPlaying.channelInfo.image}
                            alt=""
                            className="rounded-full h-12 w-12"
                          />
                        </div>
                        <div className="w-5/6">
                          <h5 className="text-sm">
                            <strong>{currentPlaying.channelInfo.name}</strong>
                          </h5>
                          <h6 className="text-gray-400 text-xs">
                            {currentPlaying.channelInfo.subscribers} subscribers
                          </h6>
                        </div>
                        <div>
                          <button className="uppercase bg-red-600 rounded-sm p-2 text-sm tracking-wider">
                            subscribe
                          </button>
                        </div>
                      </div>
                      <div
                        className={`${
                          !showMoreStatus ? "max-h-16 overflow-hidden" : ""
                        } text-sm w-11/12`}
                      >
                        <pre
                          style={{
                            fontFamily: `"Roboto", sans-serif`,
                          }}
                          className="whitespace-pre-wrap"
                        >
                          {currentPlaying.videoDescription}
                        </pre>
                      </div>
                      <div>
                        <button
                          className="uppercase text-sm cursor-pointer"
                          onClick={() => setShowMoreStatus(!showMoreStatus)}
                        >
                          Show {showMoreStatus ? "less" : "more"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Ensure recommendedVideos is an array before mapping */}
              <div className="mr-24 flex flex-col gap-3">
                {Array.isArray(recommendedVideos) && recommendedVideos.length > 0 ? (
                  recommendedVideos.map((item) => (
                    <WatchCard data={item} key={item.videoId} />
                  ))
                ) : (
                  <p>Loading recommended videos...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
