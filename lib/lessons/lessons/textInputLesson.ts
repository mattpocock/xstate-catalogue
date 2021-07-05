import { LessonType } from '../LessonType';

export const textInputLesson: LessonType<
  { value: string },
  {
    type: 'ON_CHANGE';
    value: string;
  }
> = {
  title: 'TextInput',
  initialMachineText: `createMachine({})`,
  acceptanceCriteria: {
    cases: [
      {
        steps: [
          {
            type: 'ASSERTION',
            assertion: (state) => state.context.value === '',
            description: `The value in context should be an empty string`,
          },
          {
            type: 'SEND_EVENT',
            event: {
              type: 'ON_CHANGE',
              value: 'Hello world!',
            },
          },
          {
            type: 'ASSERTION',
            assertion: (state) => state.context.value === 'Hello world!',
            description: `The value in context should equal 'Hello world!'`,
          },
        ],
      },
    ],
  },
};
