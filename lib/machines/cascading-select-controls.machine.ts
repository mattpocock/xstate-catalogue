import { assign, createMachine } from 'xstate';
import { createModel } from 'xstate/lib/model';

const model = createModel({
  firstOptions: [1, 2, 3],
  firstSelection: null as number,
  secondOptions: [] as number[],
  secondSelection: null as number,
  thirdOptions: [] as number[],
  thirdSelection: null as number,
}, {
  events: {
    FIRST_SELECTED: (value: number) => ({ value }),
    SECOND_SELECTED: (value: number) => ({ value }),
    THIRD_SELECTED: (value: number) => ({ value }),
    SECOND_OPTIONS_LOADED: (values: number[]) => ({ values }),
    THIRD_OPTIONS_LOADED: (values: number[]) => ({ values }),
  },
});

const cascadingSelectControlsMachine = createMachine<typeof model>(
  {
    id: 'cascadingSelectControls',
    context: model.initialContext,
    initial: 'awaitingFirstSelection',
    states: {
      awaitingFirstSelection: {
        on: {
          FIRST_SELECTED: {
            target: 'firstSelected',
            actions: 'assignFirstSelection',
          },
        },
      },
      firstSelected: {
        initial: 'loadingSecondOptions',
        on: {
          FIRST_SELECTED: { target: '.loadingSecondOptions', internal: false },
        },
        exit: ['clearSecond'],
        states: {
          loadingSecondOptions: {
            invoke: {
              src: 'fetchSecondOptions',
            },
            on: {
              SECOND_OPTIONS_LOADED: {
                actions: 'assignSecondOptions',
                target: 'awaitingSecondSelection',
              },
            },
          },
          awaitingSecondSelection: {
            on: {
              SECOND_SELECTED: {
                actions: 'assignSecondSelection',
                target: 'secondSelected',
              },
            },
          },
          secondSelected: {
            initial: 'loadingThirdOptions',
            on: {
              SECOND_SELECTED: { target: '.loadingThirdOptions', internal: false },
            },
            exit: ['clearThird'],
            states: {
              loadingThirdOptions: {
                invoke: {
                  src: 'fetchThirdOptions',
                },
                on: {
                  THIRD_OPTIONS_LOADED: {
                    actions: 'assignThirdOptions',
                    target: 'awaitingThirdSelection',
                  },
                },
              },
              awaitingThirdSelection: {
                on: {
                  THIRD_SELECTED: {
                    target: 'thirdSelected',
                    actions: 'assignThirdSelection',
                  },
                },
              },
              thirdSelected: {},
            },
          },
        },
      },
    },
  },
  {
    actions: {
      assignFirstSelection: model.assign({ firstSelection: (_, event) => event.value  }, 'FIRST_SELECTED'),
      assignSecondOptions: model.assign({ secondOptions: (context, event) => event.values }, 'SECOND_OPTIONS_LOADED'),
      assignSecondSelection: model.assign({ secondSelection: (context, event) => event.value }, 'SECOND_SELECTED'),
      assignThirdOptions: model.assign({ thirdOptions: (context, event) => event.values }, 'THIRD_OPTIONS_LOADED'),
      assignThirdSelection: model.assign({ thirdSelection: (context, event) => event.value }, 'THIRD_SELECTED'),
      clearSecond: model.assign(() => ({ secondOptions: model.initialContext.secondOptions, secondSelection: model.initialContext.secondSelection })),
      clearThird: model.assign(() => ({ thirdOptions: model.initialContext.thirdOptions, thirdSelection: model.initialContext.thirdSelection })),
    },
    services: {
      fetchSecondOptions: () => () => {},
      fetchThirdOptions: () => () => {}
    },
  },
);

export default cascadingSelectControlsMachine;
