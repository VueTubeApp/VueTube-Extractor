import { video } from "../src/types";
import { ytErrors } from "../src/extractors/youtube/utils";

interface testCase {
  input: string;
  expected: object;
}

interface testCaseVideo extends testCase {
  expected: Partial<video>;
}

export const getYoutubeVideoInfoTest: Array<testCaseVideo> = [
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
  {
    input: "-uleG_Vecis",
    expected: {
      title: "100+ Computer Science Concepts Explained",
      id: "-uleG_Vecis",
      descriptionText:
        "Learn the fundamentals of Computer Science with a quick breakdown of jargon that every software engineer should know. Over 100 technical concepts from the CS curriculum are explained to provide a foundation for programmers.\n\n#compsci #programming #tech\n\n🔗 Resources\n\n- Computer Science https://undergrad.cs.umd.edu/what-computer-science\n- CS101 Stanford https://online.stanford.edu/courses/soe-ycscs101-sp-computer-science-101\n- Controversial Developer Opinions https://youtu.be/goy4lZfDtCE\n- Design Patterns https://youtu.be/tv-_1er1mWI\n\n\n🔥 Get More Content - Upgrade to PRO\n\nUpgrade to Fireship PRO at https://fireship.io/pro\nUse code lORhwXd2 for 25% off your first payment. \n\n🎨 My Editor Settings\n\n- Atom One Dark \n- vscode-icons\n- Fira Code Font\n\n🔖 Topics Covered\n\nTurning Machine\nCPU\nTransistor\nBit\nByte\nCharacter Encoding ASCII\nBinary\nHexadecimal\nNibble\nMachine Code\nRAM\nMemory Address\nI/O\nKernel (Drivers)\nShell\nCommand Line Interface\nSSH\nMainframe\nProgramming Language\nAbstraction\nInterpreted\nCompiled\nExecutable\nData Types\nVariable\nDynamic Typing\nStatic Typing\nPointer\nGarbage Collector\nint \nsigned / unsigned\nfloat \nDouble\nChar\nstring\nBig endian\nLittle endian\nArray\nLinked List\nSet\nStack\nQueue\nHash\nTree\nGraph\nNodes and Edges\nAlgorithms\nFunctions\nReturn\nArguments\nOperators\nBoolean\nExpression\nStatement\nConditional Logic\nWhile Loop\nFor Loop\nIterable\nVoid\nRecursion\nCall Stack\nStack Overflow\nBase Condition\nBig-O\nTime Complexity\nSpace Complexity\nBrute Force\nDivide and conquer\nDynamic Programming\nMemoization\nGreedy\nDijkstra's Shortest Path\nBacktracking\nDeclarative\nFunctional Language\nImperative\nProcedural Language\nMultiparadigm\nOOP\nClass\nProperties\nMethods\nInheritance\nDesign Patterns\nInstantiate\nHeap Memory\nReference\nThreads\nParallelism\nConcurrency\nBare Metal\nVirtual Machine\nIP Address\nURL\nDNS\nTCP\nPackets. \nSSL\nHTTP\nAPI\nPrinters",
      metadata: {
        lengthSeconds: 787,
        isLive: false,
        isUnlisted: false,
        isPrivate: false,
        publishedAt: "2022-05-04",
        uploadedAt: "2022-05-04",
        tags: ["webdev", "app development", "lesson", "tutorial"],
      },
    },
  },
];

export const YoutubeVideoInfoErrorTest: Array<testCase> = [
  {
    input: "abcde",
    expected: ytErrors.VideoNotFoundError,
  },
  {
    input: "QB9q9HzR-Gk",
    expected: ytErrors.LoginRequiredError,
  },
];
