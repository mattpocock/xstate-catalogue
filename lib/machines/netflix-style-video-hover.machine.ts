import { assign, createMachine } from "xstate";

interface NetflixStyleVideoHoverMachineContext {
  hasVideoLoaded: boolean;
}

type NetflixStyleVideoHoverMachineEvent =
  | {
      type: "REPORT_IMAGE_LOADED";
    }
  | {
      type: "REPORT_IMAGE_FAILED_TO_LOAD";
    }
  | {
      type: "MOUSE_OVER";
    }
  | {
      type: "REPORT_VIDEO_LOADED";
    }
  | {
      type: "MOUSE_OUT";
    };

const netflixStyleVideoHoverMachine = createMachine<
  NetflixStyleVideoHoverMachineContext,
  NetflixStyleVideoHoverMachineEvent
>(
  {
    id: "netflixStyleVideoHover",
    initial: "awaitingBackgroundImageLoad",
    context: {
      hasVideoLoaded: false,
    },
    states: {
      awaitingBackgroundImageLoad: {
        on: {
          REPORT_IMAGE_LOADED: {
            target: "idle",
          },
          REPORT_IMAGE_FAILED_TO_LOAD: {
            target: "imageFailedToLoad",
          },
        },
      },
      // Things failed terribly, this is bad....
      imageFailedToLoad: {},
      idle: {
        on: {
          MOUSE_OVER: {
            target: "showingVideo",
          },
        },
      },
      showingVideo: {
        initial: "checkingIfVideoHasLoaded",
        on: {
          MOUSE_OUT: {
            target: "idle",
          },
        },
        states: {
          checkingIfVideoHasLoaded: {
            always: [
              {
                cond: "hasLoadedVideo",
                target: "waitingASecondBeforePlaying",
              },
              {
                target: "loadingVideoSrc",
              },
            ],
          },
          waitingASecondBeforePlaying: {
            after: {
              1000: {
                target: "autoPlayingVideo",
              },
            },
          },
          loadingVideoSrc: {
            initial: "cannotMoveOn",
            onDone: {
              target: "autoPlayingVideo",
            },
            states: {
              cannotMoveOn: {
                after: {
                  1000: {
                    target: "canMoveOn",
                  },
                },
                on: {
                  REPORT_VIDEO_LOADED: {
                    actions: "reportVideoLoaded",
                  },
                },
              },
              canMoveOn: {
                always: {
                  cond: "hasLoadedVideo",
                  target: "loaded",
                },
                on: {
                  REPORT_VIDEO_LOADED: {
                    actions: "reportVideoLoaded",
                    target: "loaded",
                  },
                },
              },
              loaded: {
                type: "final",
              },
            },
          },
          autoPlayingVideo: {},
        },
      },
    },
  },
  {
    guards: {
      hasLoadedVideo: (context) => {
        return context.hasVideoLoaded;
      },
    },
    actions: {
      reportVideoLoaded: assign({
        hasVideoLoaded: true,
      }),
    },
  },
);

export default netflixStyleVideoHoverMachine;
