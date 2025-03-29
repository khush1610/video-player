import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "../components/card.tsx";
import NavBar from "../components/navbar.tsx";
import SideBar from "../components/sidebar.tsx";
import Spinner from "../components/spinner.tsx";
import { clearVideos } from "../stateStore/index.ts";
import { useAppDispatch, useAppSelector } from "../stateStore/hooks.ts";
import { getHomePageVideos } from "../stateStore/reducers/getHomePageVideos.ts";
import { HomePageVideos } from "../type.ts";

export default function Home() {
  const dispatch = useAppDispatch();
  const videos = useAppSelector((state) => state.youtubeApp.videos);

  useEffect(() => {
    return () => {
      dispatch(clearVideos());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getHomePageVideos(false));
  }, [dispatch]);

  return (
    <div className="max-h-screen overflow-hidden">
      <div style={{ height: "7.5vh" }}>
        <NavBar />
      </div>
      <div className="flex" style={{ height: "92.5vh" }}>
        <SideBar />
        {videos.length ? (
          <InfiniteScroll
            dataLength={videos.length}
            next={() => dispatch(getHomePageVideos(true))}
            hasMore={videos.length < 500}
            loader={<Spinner />}
            height={650}
          >
            <div className="grid gap-y-14 gap-x-8 grid-cols-4 p-8">
              {videos.map((item: HomePageVideos) => {
                return <Card data={item} key={item.videoId} />;
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}