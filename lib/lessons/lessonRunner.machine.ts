import { inspect } from '@xstate/inspect';
import {
  assign,
  createMachine,
  EventObject,
  interpret,
  Interpreter,
  InterpreterStatus,
  StateNodeConfig,
} from 'xstate';
import type { CompileHandlerResponse } from '../../pages/api/compile';
import {
  AcceptanceCriteriaStep,
  CourseType,
  LessonType,
  AcceptanceCriteriaCase,
} from './LessonType';
import { toMachine } from './toMachine';
import party from 'party-js';

interface Context {
  course: CourseType;
  service?: Interpreter<any, any, any>;
  fileText: string;
  lessonIndex: number;
  stepCursor: {
    case: number;
    step: number;
  };
  lastErroredStep:
    | {
        case: number;
        step: number;
      }
    | undefined;
}

type Event =
  | { type: 'TEXT_EDITED'; text: string }
  | {
      type: 'STEP_DONE';
    }
  | {
      type: 'GO_TO_NEXT_LESSON';
    };

const checkingIfMachineIsValid: StateNodeConfig<Context, any, Event> = {
  entry: ['stopRunningService'],
  invoke: {
    src: async (context, event) => {
      if (!context.fileText) throw new Error();
      const result: CompileHandlerResponse = await fetch(`/api/compile`, {
        method: 'POST',
        body: JSON.stringify({ file: context.fileText }),
      }).then((res) => res.json());

      if (!result.didItWork || !result.result) {
        throw new Error();
      }

      const machine = toMachine(result.result);

      // Tests the machine to see if it fails compilation
      interpret(machine).start().stop();

      inspect();

      await new Promise((res) => waitFor(600, res as any));

      return interpret(machine, {
        devTools: true,
      });
    },
    onDone: {
      actions: assign((context, event) => {
        return {
          service: event.data,
        };
      }),
      target: 'runningTests',
    },
    onError: {
      target: 'idle.machineCouldNotCompile',
      actions: [console.log],
    },
  },
};

export const lessonMachine = createMachine<Context, Event>(
  {
    initial: 'throttling',
    context: {
      course: {} as any,
      lessonIndex: 0,
      fileText: '',
      stepCursor: {
        case: 0,
        step: 0,
      },
      lastErroredStep: undefined,
    },
    on: {
      TEXT_EDITED: {
        target: '.throttling',
        actions: assign((context, event) => {
          return {
            fileText: event.text,
          };
        }),
        internal: false,
      },
    },
    states: {
      idle: {
        id: 'idle',
        initial: 'machineValid',
        states: {
          machineValid: {
            initial: 'testsNotPassed',
            states: {
              testsNotPassed: {},
              testsPassed: {
                tags: 'testsPassed',
                on: {
                  GO_TO_NEXT_LESSON: {
                    target: '#movingToNextLesson',
                  },
                },
                entry: [
                  () => {
                    party.confetti(
                      new party.Circle(
                        window.innerWidth / 2,
                        window.innerHeight / 2,
                      ),
                      {
                        size: window.innerWidth,
                      },
                    );
                  },
                ],
              },
            },
          },
          machineCouldNotCompile: {},
        },
      },
      throttling: {
        after: {
          700: 'checkingIfMachineIsValid',
        },
      },
      movingToNextLesson: {
        id: 'movingToNextLesson',
        always: {
          actions: [
            'stopRunningService',
            assign((context, event) => {
              return {
                stepCursor: {
                  case: 0,
                  step: 0,
                },
                lessonIndex: context.lessonIndex + 1,
                lastErroredStep: null,
              };
            }),
            'autoFormatEditor',
          ],
          target: 'checkingIfMachineIsValid',
        },
      },
      checkingIfMachineIsValid,
      runningTests: {
        entry: ['resetLessonCursor', 'startService'],
        initial: 'runningStep',
        onDone: {
          target: 'idle.machineValid.testsPassed',
        },
        states: {
          runningStep: {
            on: {
              STEP_DONE: {
                target: 'checkingIfThereIsAnIncompleteStep',
              },
            },
            invoke: {
              src: 'runTestStep',
              onError: {
                target: '#idle.machineValid.testsNotPassed',
                actions: ['markStepAsErrored'],
              },
            },
          },
          checkingIfThereIsAnIncompleteStep: {
            always: [
              {
                cond: 'isThereAnIncompleteStepInThisCase',
                actions: 'incrementToNextStep',
                target: 'runningStep',
              },
              {
                cond: 'isThereAnIncompleteStep',
                actions: ['restartService', 'incrementToNextStep'],
                target: 'runningStep',
              },
              {
                target: 'complete',
              },
            ],
          },
          complete: {
            type: 'final',
          },
        },
      },
    },
  },
  {
    services: {
      runTestStep: (context, event) => (send) => {
        const cases = getCurrentLessonCases(context);
        const currentStep =
          cases[context.stepCursor.case].steps[context.stepCursor.step];

        if (!currentStep || !context.service) return;

        runTestStep(currentStep, context.service, () => send('STEP_DONE'));
      },
    },
    guards: {
      isThereAnIncompleteStepInThisCase: (context) => {
        const cases = getCurrentLessonCases(context);
        const nextStep = getNextSteps(cases, context.stepCursor);

        return nextStep && nextStep.case === context.stepCursor.case;
      },
      isThereAnIncompleteStep: (context) => {
        const cases = getCurrentLessonCases(context);
        const nextStep = getNextSteps(cases, context.stepCursor);
        return Boolean(nextStep);
      },
    },
    actions: {
      startService: (context) => {
        if (
          context.service &&
          context.service.status !== InterpreterStatus.Running
        ) {
          context.service.start();
        }
      },
      restartService: (context) => {
        if (
          context.service &&
          context.service.status === InterpreterStatus.Running
        ) {
          context.service.stop();
          context.service.start();
        }
      },
      stopRunningService: (context) => {
        if (
          context.service &&
          context.service.status === InterpreterStatus.Running
        ) {
          context.service.stop();
        }
      },
      incrementToNextStep: assign((context) => {
        const cases = getCurrentLessonCases(context);
        const nextStep = getNextSteps(cases, context.stepCursor);
        if (!nextStep) return {};

        return {
          stepCursor: nextStep,
        };
      }),
      markStepAsErrored: assign((context) => {
        return {
          lastErroredStep: context.stepCursor,
        };
      }),
      resetLessonCursor: assign(() => ({
        stepCursor: {
          case: 0,
          step: 0,
        },
        lastErroredStep: undefined,
      })),
    },
  },
);

const getNextSteps = (
  cases: AcceptanceCriteriaCase[],
  stepCursor: { case: number; step: number },
): { case: number; step: number } | null => {
  const currentCursor = stepCursor;
  const currentCase = cases[currentCursor.case];

  if (currentCase && currentCase.steps[currentCursor.step + 1]) {
    return {
      case: currentCursor.case,
      step: currentCursor.step + 1,
    };
  }

  const nextCase = cases[currentCursor.case + 1];

  if (nextCase) {
    return {
      case: currentCursor.case + 1,
      step: 0,
    };
  }

  return null;
};

const runTestStep = <TContext, TEvent extends EventObject>(
  step: AcceptanceCriteriaStep<TContext, TEvent>,
  service: Interpreter<TContext, any, TEvent>,
  callback: () => void,
) => {
  let state = service.state;
  const unsubscribeHandlers: (() => void)[] = [];

  const unsub = service.subscribe((newState) => {
    state = newState;
  });

  unsubscribeHandlers.push(unsub.unsubscribe);

  switch (step.type) {
    case 'ASSERTION':
      {
        const succeeded = step.assertion(state);

        if (!succeeded) {
          throw new Error('Assertion failed');
        }
        callback();
      }
      break;
    case 'OPTIONS_ASSERTION':
      {
        const succeeded = step.assertion(service.machine.options);

        if (!succeeded) {
          throw new Error('Assertion failed');
        }
        callback();
      }
      break;
    case 'SEND_EVENT':
      {
        service.send(step.event);
        callback();
      }
      break;
    case 'WAIT':
      {
        const unwait = waitFor(step.durationInMs, callback);
        unsubscribeHandlers.push(unwait);
      }
      break;
  }

  return () => {
    unsubscribeHandlers.forEach((func) => func());
  };
};

const waitFor = (ms: number, callback: () => void): (() => void) => {
  let timeout = setTimeout(callback, ms);

  return () => {
    clearTimeout(timeout);
  };
};

const getCurrentLesson = (context: Context): LessonType => {
  return context.course.lessons[context.lessonIndex];
};

export const getCurrentLessonCases = (
  context: Context,
): AcceptanceCriteriaCase<any, any>[] => {
  if (context.lessonIndex === 0) {
    return context.course.lessons[0].acceptanceCriteria.cases;
  }

  const currentLesson = getCurrentLesson(context);

  if (!currentLesson.mergeWithPreviousCriteria) {
    return currentLesson.acceptanceCriteria.cases;
  }

  const cases: AcceptanceCriteriaCase<any, any>[] = [];

  let cursorIndex = context.lessonIndex;

  while (cursorIndex >= 0) {
    const targetLesson = context.course.lessons[cursorIndex];

    cases.unshift(...targetLesson.acceptanceCriteria.cases);

    if (!targetLesson.mergeWithPreviousCriteria) {
      break;
    }

    cursorIndex--;
  }

  return cases;
};
