import {
  assign,
  createMachine,
  EventObject,
  interpret,
  Interpreter,
  InterpreterStatus,
} from 'xstate';
import { DUMMY_MACHINE } from './dummyMachine';
import { AcceptanceCriteriaStep, LessonType } from './LessonType';

interface Context {
  lesson: LessonType<any, any>;
  service?: Interpreter<any, any, any>;
  userText: string;
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

type Event = { type: 'TEXT_EDITED'; text: string };

export const lessonMachine = createMachine<Context, Event>(
  {
    initial: 'throttling',
    context: {
      lesson: {} as any,
      userText: '',
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
            userText: event.text,
          };
        }),
        internal: true,
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
              },
            },
          },
          machineCouldNotCompile: {},
        },
      },
      throttling: {
        after: {
          200: 'checkingIfMachineIsValid',
        },
      },
      checkingIfMachineIsValid: {
        invoke: {
          src: async (context, event) => {
            // TODO - extract machine from context.userText
            return interpret(DUMMY_MACHINE).start();
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
          },
        },
      },
      runningTests: {
        entry: ['resetLessonCursor'],
        initial: 'runningStep',
        onDone: {
          target: 'idle.machineValid.testsPassed',
        },
        exit: ['stopRunningService'],
        states: {
          runningStep: {
            invoke: {
              src: 'runTestStep',
              onError: {
                target: '#idle.machineValid.testsNotPassed',
                actions: ['markStepAsErrored'],
              },
              onDone: {
                target: 'checkingIfThereIsAnIncompleteStep',
              },
            },
          },
          checkingIfThereIsAnIncompleteStep: {
            always: [
              {
                cond: 'isThereAnIncompleteStep',
                actions: 'incrementToNextStep',
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
      runTestStep: async (context, event) => {
        const currentStep =
          context.lesson.acceptanceCriteria.cases[context.stepCursor.case]
            .steps[context.stepCursor.step];

        if (!currentStep || !context.service) return;

        runTestStep(currentStep, context.service);
      },
    },
    guards: {
      isThereAnIncompleteStep: (context) => {
        return Boolean(getNextSteps(context.lesson, context.stepCursor));
      },
    },
    actions: {
      stopRunningService: (context) => {
        if (
          context.service &&
          context.service.status === InterpreterStatus.Running
        ) {
          context.service.stop();
        }
      },
      incrementToNextStep: assign((context) => {
        const nextStep = getNextSteps(context.lesson, context.stepCursor);
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
  lesson: LessonType<any, any>,
  stepCursor: { case: number; step: number },
): { case: number; step: number } | null => {
  const currentCursor = stepCursor;
  const currentCase = lesson.acceptanceCriteria.cases[currentCursor.case];

  if (currentCase && currentCase.steps[currentCursor.step + 1]) {
    return {
      case: currentCursor.case,
      step: currentCursor.step + 1,
    };
  }

  const nextCase = lesson.acceptanceCriteria.cases[currentCursor.case + 1];

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
) => {
  let unsubscribe = () => {};

  switch (step.type) {
    case 'ASSERTION':
      {
        const succeeded = step.assertion(service.state);

        if (!succeeded) {
          throw new Error('Assertion failed');
        }
      }
      break;
    case 'SEND_EVENT': {
      service.send(step.event);
    }
  }

  return unsubscribe;
};
