import video from "../src/types/video";

type testCase = {
    input: string;
    expected: video;
}

const getYoutubeVideoInfoTest: testCase = {
    input: "https://www.youtube.com/watch?v=mN0zPOpADL4",
    expected: {
        title: "Agent 327: Operation Barbershop",
        descriptionText: "This three-minute teaser for a full-length animated feature is based on Dutch artist Martin Lodewijk's classic comics series Agent 327. The Blender Animation Studio is currently developing the story and seeks for funding to bring this adventurous comedy animation film to an international audience. \n\nMore information: https://agent327.com \n\nEntirely made in Blender, released as Creative Commons for Blender Cloud subscribers. \n\nJoin https://cloud.blender.org today, get 10 years of film production history, tutorials, and help us making more!",
        thumbnails: [
            {
                "url": "https://i.ytimg.com/vi_webp/mN0zPOpADL4/default.webp",
                "width": 120,
                "height": 90
            },
            {
                "url": "https://i.ytimg.com/vi_webp/mN0zPOpADL4/mqdefault.webp",
                "width": 320,
                "height": 180
            },
            {
                "url": "https://i.ytimg.com/vi_webp/mN0zPOpADL4/hqdefault.webp",
                "width": 480,
                "height": 360
            },
            {
                "url": "https://i.ytimg.com/vi_webp/mN0zPOpADL4/sddefault.webp",
                "width": 640,
                "height": 480
            }
        ],
        metadata: {
            lengthSeconds: 232,
            isLive: false,
            wasLive: false,
            isUnlisted: false,
            isPrivate: false,
            publishedAt: "May 15, 2017",
            tags: [
                "animation",
                "blender",
                "cartoon",
                "comics",
                "trailer",
                "teaser",
                "agent 327",
                "dutch",
                "b3d",
                "blender 3d"
            ],
            channel: {
                channelId: "UCz75RVbH8q2jdBJ4SnwuZZQ",
                channelUrl: "/channel/UCz75RVbH8q2jdBJ4SnwuZZQ",
                channelName: "Blender Studio",
                channelThumbnails: [
                    {
                        "url": "https://yt3.ggpht.com/6hLbEq5VTd1_44WZjB4LzDIgLNXoilzFoi-4UqniFC0aV25T366LdCw6NMpb4SFhISlTO3lewQ=s68-c-k-c0x00ffffff-no-rj",
                        "width": 68,
                        "height": 68
                    }
                ]
            }
        }
    }
}

export default { getYoutubeVideoInfoTest }