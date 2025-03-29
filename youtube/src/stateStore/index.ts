import { InitialState } from "../type";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getHomePageVideos } from "./reducers/getHomePageVideos.ts";
import { getSearchPageVideos } from "./reducers/getSearchPageVideos.ts";
import { getVideoDetails } from "./reducers/getVideoDetails.ts";
import { getRecommendedVideos } from "./reducers/getRecommendedVideos.ts";

const initialState:InitialState = {
    videos: [],
    currentVideo: null,
    searchTerm: "",
    searchResults: [],
    nextPageToken: null,
    recommendedVideos: [],
};

const YoutubeSlice = createSlice({
    name: "youtubeApp",
    initialState,
    reducers: {
    changeSearchTerm: (state, action: PayloadAction<string>) => {
    state.searchTerm = action.payload;
    },
    clearVideos: (state) => {
        state.videos = [];
        state.nextPageToken = null;
    },
    clearSearchTerm: (state) => {
        state.searchTerm = "";
    },
},
    extraReducers: (builder) => {
        builder.addCase(getHomePageVideos.fulfilled, (state, action) => {
            state.videos = action.payload.parsedData;
            state.nextPageToken = action.payload.nextPageToken;
        });
        builder.addCase(getSearchPageVideos.fulfilled, (state, action) => {
            state.videos = action.payload.parsedData;
            state.nextPageToken = action.payload.nextPageToken;
        });
        builder.addCase(getVideoDetails.fulfilled, (state, action) => {
            state.currentVideo = action.payload;
        });
        builder.addCase(getRecommendedVideos.fulfilled, (state, action) => {
            state.recommendedVideos = action.payload;
        });
    },
    
});

export const stateStore = configureStore({
    reducer: {
        youtubeApp: YoutubeSlice.reducer,
    },
});

export type RootState = ReturnType<typeof stateStore.getState>;
export type AppDispatch = typeof stateStore.dispatch;
export const { changeSearchTerm, clearVideos, clearSearchTerm } = YoutubeSlice.actions;
