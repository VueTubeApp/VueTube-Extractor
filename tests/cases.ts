import video from "../src/types/video";

type testCaseVideo = {
  input: string;
  expected: Partial<video>;
};

export const getYoutubeVideoInfoTest: testCaseVideo[] = [
  {
    input: "mN0zPOpADL4",
    expected: {
      title: "Agent 327: Operation Barbershop",
      id: "mN0zPOpADL4",
      descriptionText:
        "This three-minute teaser for a full-length animated feature is based on Dutch artist Martin Lodewijk's classic comics series Agent 327. The Blender Animation Studio is currently developing the story and seeks for funding to bring this adventurous comedy animation film to an international audience. \n\nMore information: https://agent327.com \n\nEntirely made in Blender, released as Creative Commons for Blender Cloud subscribers. \n\nJoin https://cloud.blender.org today, get 10 years of film production history, tutorials, and help us making more!",
      metadata: {
        lengthSeconds: 232,
        isLive: false,
        isUnlisted: false,
        isPrivate: false,
        publishedAt: "2017-05-15",
        uploadedAt: "2017-05-15",
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
          "blender 3d",
        ],
      },
    },
  },
];
