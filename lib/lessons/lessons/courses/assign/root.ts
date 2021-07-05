import { CourseType } from '../../../LessonType';

const assignCourse: CourseType = {
  title: 'Assign',
  initialMachineText: `createMachine({
  context: {
    count: 0,
  },
  on: {
    INCREMENT: {
      actions: [assign({
        count: (context) => context.count - 1
      })]
    }
  }
})`,
  lessons: [
    {
      acceptanceCriteria: {
        cases: [
          {
            steps: [
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'INCREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 1,
                description: `The 'count' in context should equal 1`,
              },
            ],
          },
        ],
      },
    },
    {
      mergeWithPreviousCriteria: true,
      acceptanceCriteria: {
        cases: [
          {
            steps: [
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'DECREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === -1,
                description: `The 'count' in context should equal -1`,
              },
            ],
          },
        ],
      },
    },
    {
      acceptanceCriteria: {
        cases: [
          {
            steps: [
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 0,
                description: `The 'pressCount' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'DECREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === -1,
                description: `The 'count' in context should equal -1`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 1,
                description: `The 'pressCount' in context should equal 1`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'INCREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 2,
                description: `The 'pressCount' in context should equal 2`,
              },
            ],
          },
        ],
      },
    },
    {
      acceptanceCriteria: {
        cases: [
          {
            steps: [
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 0,
                description: `The 'pressCount' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'DECREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === -1,
                description: `The 'count' in context should equal -1`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 0,
                description: `The 'pressCount' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'INCREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 0,
                description: `The 'pressCount' in context should equal 0`,
              },
            ],
          },
        ],
      },
    },
    {
      acceptanceCriteria: {
        cases: [
          {
            steps: [
              {
                type: 'OPTIONS_ASSERTION',
                assertion: (options) =>
                  Boolean(options.actions.incrementPressCount),
                description: `Must have an action called 'incrementPressCount' defined`,
              },
            ],
          },
          {
            steps: [
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 0,
                description: `The 'pressCount' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'DECREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === -1,
                description: `The 'count' in context should equal -1`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 1,
                description: `The 'pressCount' in context should equal 1`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'INCREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 2,
                description: `The 'pressCount' in context should equal 2`,
              },
            ],
          },
        ],
      },
    },
    {
      acceptanceCriteria: {
        cases: [
          {
            steps: [
              {
                type: 'OPTIONS_ASSERTION',
                assertion: (options) =>
                  Boolean(options.actions.incrementPressCount),
                description: `Must have an action called 'incrementPressCount' defined`,
              },
            ],
          },
          {
            steps: [
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 0,
                description: `The 'pressCount' in context should equal 0`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'DECREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === -1,
                description: `The 'count' in context should equal -1`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 1,
                description: `The 'pressCount' in context should equal 1`,
              },
              {
                type: 'SEND_EVENT',
                event: {
                  type: 'INCREMENT',
                },
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.count === 0,
                description: `The 'count' in context should equal 0`,
              },
              {
                type: 'ASSERTION',
                assertion: (state) => state.context.pressCount === 3,
                description: `The 'pressCount' in context should equal 3`,
              },
            ],
          },
        ],
      },
    },
  ],
};

export default assignCourse;
