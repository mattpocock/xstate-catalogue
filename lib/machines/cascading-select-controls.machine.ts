import { assign, createMachine, Sender } from "xstate";

export interface CascadingSelectControlsMachineContext {
  firstOptions: number[];
  firstSelection: number;
  secondOptions: number[];
  secondSelection: number;
  thirdOptions: number[];
  thirdSelection: number;
};

export type CascadingSelectControlsMachineEvent =
  | {
      type: "FIRST_SELECTED";
      data: {value: number};
    }
  |{
    type: "SECOND_SELECTED";
    data: {value: number};
  }
  |{
    type: "THIRD_SELECTED";
    data: {value: number};
  };

const cascadingSelectControlsMachine = createMachine<
  CascadingSelectControlsMachineContext,
  CascadingSelectControlsMachineEvent
>(
  {
    id: "cascadingSelectControls",
    initial: "awaitingFirstSelection",
    states: {
      awaitingFirstSelection: {
        on: {
          FIRST_SELECTED: {
            target: "firstSelected",
            actions: assign({firstSelection: (context, event) => event?.data.value})
          }
        },
      },
      firstSelected: {
        initial: "loadingSecondOptions",
        on: {
          FIRST_SELECTED: ".loadingSecondOptions"
        },
        states: {
          loadingSecondOptions: {
            invoke: {
              src: 'fetchSecondOptions',
              onDone: {
                target: 'awaitingSecondSelection',
                actions: assign({secondOptions: (context, event) => event?.data.values})
              }
            }
          },
          awaitingSecondSelection: {
            on: {
              SECOND_SELECTED: {
                target: "loadingThirdOptions",
                actions: assign({secondSelection: (context, event) => event.data.value})
              }
            }
          },
          loadingThirdOptions: {
            invoke: {
              src: 'fetchThirdOptions',
              onDone: {
                target: 'secondSelected',
                actions: assign({thirdOptions: (context, event) => event?.data.values})
              }
            }
          },
          secondSelected: {
            initial: "awaitingThirdSelection",
            on: {
              SECOND_SELECTED: "loadingThirdOptions"
            },
            states: {
              awaitingThirdSelection: {
                on: {
                  THIRD_SELECTED: {
                    target: "thirdSelected",
                    actions: assign({ thirdSelection: (context, event) => event.data.value })
                  }
                }
              },
              thirdSelected: {}
            }
          }
        }
      }
    },
  },
  {
    services: {
      fetchSecondOptions: () => () => {},
      fetchThirdOptions: () => () => {}
    }
  }
);

export const metadata = {
  eventPayloads: {
    FIRST_SELECTED: {data: 1},
    SECOND_SELECTED: {data: 4},
  }
};
export default cascadingSelectControlsMachine;
