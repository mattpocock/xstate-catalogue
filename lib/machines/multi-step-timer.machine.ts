import { createMachine } from 'xstate';

export type MultiStepTimerMachineContext = {};

export type MultiStepTimerMachineEvent = {
  type: 'BEGIN';
};

const multiStepTimerMachine = createMachine<
  MultiStepTimerMachineContext,
  MultiStepTimerMachineEvent
>({
  id: 'multiStepTimer',
  initial: 'idle',
  states: {
    idle: {
      on: {
        BEGIN: {
          target: 'firstStep',
        },
      },
    },
    firstStep: {
      after: {
        3000: 'secondStep',
      },
    },
    secondStep: {
      after: {
        3000: 'thirdStep',
      },
    },
    thirdStep: {
      after: {
        3000: 'idle',
      },
    },
  },
});

export default multiStepTimerMachine;
