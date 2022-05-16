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
  {
    input: "aqz-KE-bpKQ",
    expected: {
      title: "Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film",
      id: "aqz-KE-bpKQ",
      descriptionText:
        "Enjoy this UHD High Frame rate version of one of the iconic short films produced by Blender Institute!\nLearn more about the project here http://bbb3d.renderfarming.net. Support more Open Content at http://cloud.blender.org.\n\nNOTE: currently, YouTube allows 60fps only on 1080p videos. We uploaded the video in UHD, so maybe in the future it will be available in UHD 60p. You can download the original version at http://bbb3d.renderfarming.net.",
      metadata: {
        lengthSeconds: 635,
        isLive: false,
        isUnlisted: false,
        isPrivate: false,
        publishedAt: "2014-11-10",
        uploadedAt: "2014-11-10",
        tags: [
          "blender",
          "animation",
          "4K",
          "UHD",
          "Big Buck Bunny (Film)",
          "Blender Foundation (Nonprofit Organization)",
          "Short Film (Film Genre)",
          "4K Resolution",
        ],
      },
    },
  },
];
