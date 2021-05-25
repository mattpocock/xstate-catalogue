import { createMachine, assign } from 'xstate';

export const DUMMY_MACHINE = createMachine({
  initial: 'idle',
  context: {
    page: 1,
  },
  states: {
    idle: {
      on: {
        NEXT_PAGE: {
          actions: assign((context, event) => {
            return {
              page: context.page + 1,
            };
          }),
        },
        PREV_PAGE: {
          actions: assign((context, event) => {
            return {
              page: context.page - 1,
            };
          }),
        },
      },
    },
  },
});
