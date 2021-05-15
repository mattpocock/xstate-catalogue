import { createMachine, assign } from 'xstate';

export const DUMMY_MACHINE = createMachine({
  initial: 'idle',
  states: {
    idle: {},
  },
});
