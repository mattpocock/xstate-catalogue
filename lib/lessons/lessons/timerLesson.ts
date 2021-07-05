import { LessonType } from '../LessonType';

export const timerLesson: LessonType = {
  title: 'Timer',
  initialMachineText: `createMachine({
    initial: 'initial',
    states: {
      initial: {
        after: {
          800: 'final'
        }
      },
      final: {}
    }
  })`,
  acceptanceCriteria: {
    cases: [
      {
        steps: [
          {
            type: 'ASSERTION',
            assertion: (state) => state.matches('initial'),
            description: `Should start in the 'initial' state`,
          },
          {
            type: 'WAIT',
            durationInMs: 800,
          },
          {
            type: 'ASSERTION',
            assertion: (state) => state.matches('final'),
            description: `Should end up in the 'final' state`,
          },
        ],
      },
      {
        steps: [
          {
            type: 'ASSERTION',
            assertion: (state) => state.matches('initial'),
            description: `Should start in the 'initial state'`,
          },
          {
            type: 'WAIT',
            durationInMs: 700,
          },
          {
            type: 'ASSERTION',
            assertion: (state) => state.matches('initial'),
            description: `Should still be in the 'initial' state`,
          },
        ],
      },
    ],
  },
};
