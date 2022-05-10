type videoSelection = {
  id: string;
  title: string;
  descriptionText: string;
  channel: {
    channelId: string;
    channelUrl: string;
    channelName: string;
    channelThumbnails: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  metadata: {
    views: number;
    published?: string;
    overlay?: {
      text: string;
      style: string;
    };
    thumbnails: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
};

export default videoSelection;
