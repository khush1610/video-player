
import axios from "axios";
import { YOUTUBE_API_URL } from "../utils/constants.ts";
import { HomePageVideos } from "../type.ts";
import { timeSince } from "./timeS.ts";
import { parseVideoDuration } from "./parseVideoDur.ts";
import { convertRawtoString } from "./convertRawtoStrings.ts";

const API_KEY = process.env.REACT_APP_YT_DATA_APIKEY;

export const parseData = async (items: any[]) => {
    try {
        const videoIds: string[] = [];
        const channelIds: string[] = [];

        items.forEach((item: { snippet: { channelId: string }; id: { videoId: string } }) => {
            channelIds.push(item.snippet.channelId);
            videoIds.push(item.id.videoId);
        });

        const {
            data: { items: channelData },
        } = await axios.get(
            `${YOUTUBE_API_URL}/channels?part=snippet,contentDetails&id=${channelIds.join(
                ","
            )}&key=${API_KEY}`
        );

        const parsedChannelsData: { id: string; image: string }[] = [];
        channelData.forEach(
            (channel: {
                id: string;
                snippet: { thumbnails: { default: { url: string } } };
            }) =>
                parsedChannelsData.push({
                    id: channel.id,
                    image: channel.snippet.thumbnails.default.url,
                })
        );

        const {
            data: { items: videoData },
        } = await axios.get(
            `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds.join(
                ","
            )}&key=${API_KEY}`
        );

        const parsedData: HomePageVideos[] = [];
        items.forEach((item: { id: { videoId: string }; snippet: { channelId: string } }, index: number) => {
            const channelInfo = parsedChannelsData.find((data) => data.id === item.snippet.channelId);
            if (channelInfo) {
                parsedData.push({
                    videoId: item.id.videoId,
                    videoTitle: item.snippet.title,
                    videoDescription: item.snippet.description,
                    videoThumbnail: item.snippet.thumbnails.medium.url,
                    videoLink: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    videoDuration: parseVideoDuration(videoData[index].contentDetails.duration),
                    videoViews: convertRawtoString(videoData[index].statistics.viewCount),
                    videoAge: timeSince(new Date(item.snippet.publishedAt)),
                    channelInfo: {
                        id: item.snippet.channelId,
                        name: item.snippet.channelTitle,
                        image: channelInfo.image,
                    },
                });
            }
        });
        return parsedData;
    } catch (error) {
        console.error("Error parsing data:", error);
        throw error;
    }
};
