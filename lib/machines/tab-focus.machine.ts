import { assign, createMachine, Sender } from "xstate";

interface TabFocusMachineContext {}

type TabFocusMachineEvent =
  | {
      type: "REPORT_TAB_BLUR";
    }
  | {
      type: "REPORT_TAB_FOCUS";
    };

const tabFocusMachine = createMachine<
  TabFocusMachineContext,
  TabFocusMachineEvent
>(
  {
    id: "tabFocus",
    initial: "userIsOnTab",
    states: {
      userIsOnTab: {
        invoke: {
          src: "checkForDocumentBlur",
        },
        on: {
          REPORT_TAB_BLUR: "userIsNotOnTab",
        },
      },
      userIsNotOnTab: {
        invoke: {
          src: "checkForDocumentFocus",
        },
        on: {
          REPORT_TAB_FOCUS: "userIsOnTab",
        },
      },
    },
  },
  {
    delays: {
      IDLE_CHECK_DELAY: 3000,
      IDLE_TIME_OUT_DELAY: 3000,
    },
    services: {
      checkForDocumentBlur: () => (send: Sender<TabFocusMachineEvent>) => {
        const listener = () => {
          send("REPORT_TAB_BLUR");
        };

        window.addEventListener("blur", listener);

        return () => {
          window.removeEventListener("blur", listener);
        };
      },
      checkForDocumentFocus: () => (send: Sender<TabFocusMachineEvent>) => {
        const listener = () => {
          send("REPORT_TAB_FOCUS");
        };

        window.addEventListener("focus", listener);

        return () => {
          window.removeEventListener("focus", listener);
        };
      },
    },
  },
);

export default tabFocusMachine;
