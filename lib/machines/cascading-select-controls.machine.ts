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
            actions: "assignFirstSelection"
          }
        },
      },
      firstSelected: {
        initial: "loadingSecondOptions",
        on: {
          FIRST_SELECTED: {target: ".loadingSecondOptions", internal: false}
        },
        exit: ['clearSecond'],
        states: {
          loadingSecondOptions: {
            invoke: {
              src: "fetchSecondOptions",
              onDone: {
                target: "awaitingSecondSelection",
                actions: "assignSecondOptions"
              }
            }
          },
          awaitingSecondSelection: {
            on: {
              SECOND_SELECTED: {
                target: "loadingThirdOptions",
                actions: "assignSecondSelection"
              }
            }
          },
          loadingThirdOptions: {
            invoke: {
              src: "fetchThirdOptions",
              onDone: {
                target: "secondSelected",
                actions: "assignThirdOptions"
              }
            }
          },
          secondSelected: {
            initial: "awaitingThirdSelection",
            on: {
              SECOND_SELECTED: {target: "loadingThirdOptions", internal: false}
            },
            exit: ['clearThird'],
            states: {
              awaitingThirdSelection: {
                on: {
                  THIRD_SELECTED: {
                    target: "thirdSelected",
                    actions: "assignThirdSelection"
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
    actions: {
      assignFirstSelection: assign({firstSelection: (context, event) => event.data.value}),
      assignSecondOptions: assign({secondOptions: (context, event) => event.data.values}),
      assignSecondSelection: assign({secondSelection: (context, event) => event.data.value}),
      assignThirdOptions: assign({thirdOptions: (context, event) => event.data.values}),
      assignThirdSelection: assign({thirdSelection: (context, event) => event.data.value}),
      clearSecond: assign({secondOptions: null, secondSelection: null}),
      clearThird: assign({thirdOptions: null, thirdSelection: null})
    },
    services: {
      fetchSecondOptions: () => () => {},
      fetchThirdOptions: () => () => {}
    }
  }
);

export default cascadingSelectControlsMachine;
