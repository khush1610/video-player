import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { HomePageVideos } from "../../type.ts";
import { parseData } from "../../utils/index.ts";
import { YOUTUBE_API_URL } from "../../utils/constants.ts";

const API_KEY = process.env.REACT_APP_YT_DATA_APIKEY;

export const getHomePageVideos = createAsyncThunk(
  "youtubeApp/getHomePageVideos",
  async (isNext: boolean, { getState }) => {
    const {
      youtubeApp: { nextPageToken: nextPageTokenFromState, videos },
    } = getState() as RootState;
    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search?maxResults=20&q="one direction"&key=${API_KEY}&part=snippet&type=video&${
        isNext ? `pageToken=${nextPageTokenFromState}` : ""
      }`
    );
    console.log({ items, nextPageTokenFromState, nextPageToken });
    const parsedData: HomePageVideos[] = await parseData(items);
    return { parsedData: [...videos, ...parsedData], nextPageToken };
  }
);