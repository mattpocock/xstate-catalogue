import { actions, assign, createMachine, Sender } from "xstate";

interface DebounceMachineContext {
  action?: () => void;
}

type DebounceMachineEvent = {
  type: "GO";
  action: () => void;
};

const debounceMachine = createMachine<
  DebounceMachineContext,
  DebounceMachineEvent
>(
  {
    id: "debounce",
    initial: "idle",
    states: {
      idle: {
        on: {
          GO: {
            actions: "assignActionToContext",
            target: "debouncing",
          },
        },
      },
      debouncing: {
        on: {
          GO: {
            actions: "assignActionToContext",
            target: "debouncing",
          },
        },
        after: {
          2000: {
            target: "idle",
            actions: "performAction",
          },
        },
      },
    },
  },
  {
    actions: {
      clearAction: assign({
        action: undefined,
      }),
      assignActionToContext: assign((context, event) => {
        return {
          action: event.action,
        };
      }),
      performAction: (context) => {
        return context.action();
      },
    },
  },
);

export default debounceMachine;
