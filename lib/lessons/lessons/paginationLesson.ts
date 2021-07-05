import { LessonType } from '../LessonType';

export const paginationLesson: LessonType<
  { page: number },
  | {
      type: 'NEXT_PAGE';
    }
  | {
      type: 'PREV_PAGE';
    }
> = {
  title: 'Pagination',
  initialMachineText: `createMachine({})`,
  acceptanceCriteria: {
    cases: [
      {
        steps: [
          {
            type: 'ASSERTION',
            assertion: (state) => state.matches('idle'),
            description: `Should start in the 'idle' state`,
          },
          {
            type: 'ASSERTION',
            assertion: (state) => state.context.page === 1,
            description: `Page value in context should equal 1`,
          },
          {
            type: 'SEND_EVENT',
            event: {
              type: 'NEXT_PAGE',
            },
          },
          {
            type: 'ASSERTION',
            assertion: (state) => state.context.page === 2,
            description: `Page value in context should equal 2`,
          },
          {
            type: 'SEND_EVENT',
            event: {
              type: 'PREV_PAGE',
            },
          },
          {
            type: 'ASSERTION',
            assertion: (state) => state.context.page === 1,
            description: `Page value in context should equal 1`,
          },
        ],
      },
    ],
  },
};
