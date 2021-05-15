import CheckOutlined from '@material-ui/icons/CheckOutlined';
import { useMachine } from '@xstate/react';
import { lessonMachine } from '../lib/lessons/lessonRunner.machine';
import { paginationLesson } from '../lib/lessons/lessons/paginationLesson';
import classNames from 'classnames';

export const someValue = 'yes';

const LessonDemo = () => {
  const [state, send] = useMachine(lessonMachine, {
    context: {
      lesson: paginationLesson,
    },
  });

  const { lesson, ...context } = state.context;

  // const erroredStep =
  //   context.lastErroredStep &&
  //   lesson.acceptanceCriteria.cases[context.lastErroredStep.case].steps[
  //     context.lastErroredStep.step
  //   ];

  return (
    <div className="p-6">
      {/* <button onClick={() => send('TEXT_EDITED')}>Edit Text</button> */}
      {lesson.acceptanceCriteria.cases.map((acceptanceCase, caseIndex) => {
        return (
          <div className="max-w-md space-y-4">
            {acceptanceCase.steps.map((step, stepIndex) => {
              let status: 'notComplete' | 'errored' | 'complete' =
                'notComplete';
              if (
                state.context.lastErroredStep?.step === stepIndex &&
                state.context.lastErroredStep?.case === caseIndex
              ) {
                status = 'errored';
              } else if (
                state.hasTag('testsPassed') ||
                (caseIndex <= context.stepCursor.case &&
                  stepIndex < context.stepCursor.step)
              ) {
                status = 'complete';
              }
              return (
                <div
                  className={classNames(
                    'flex items-center p-2 px-3 space-x-2 font-medium border',
                    {
                      'border-gray-200 text-gray-700 bg-gray-100':
                        status === 'notComplete',
                      'border-green-200 text-green-700 bg-green-100':
                        status === 'complete',
                      'border-red-200 text-red-700 bg-red-100':
                        status === 'errored',
                    },
                  )}
                >
                  <CheckOutlined />
                  {step.type === 'ASSERTION' && <p>{step.description}</p>}
                  {step.type === 'SEND_EVENT' && (
                    <p>Send a {step.event.type} event</p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {/* {erroredStep && (
        <div className="p-6 bg-red-100">
          {erroredStep.type === 'ASSERTION' && (
            <p>Error: {erroredStep.description}</p>
          )}
        </div>
      )} */}
    </div>
  );
};

export default LessonDemo;
