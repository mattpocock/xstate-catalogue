import { assign, createMachine } from 'xstate';

export interface CarouselMachineContext {
  activeIndex: number;
  totalSlideCount: number;
  interval: number;
}

export type CarouselMachineEvent =
  | { type: 'UPDATE_INDEX'; index?: number }
  | { type: 'PAUSE' }
  | { type: 'NEXT_INDEX' }
  | { type: 'PREV_INDEX' }
  | { type: 'RESET' }
  | { type: 'AUTO_PLAY' };

const calculateNextIndex = (
  context: CarouselMachineContext,
  event: CarouselMachineEvent,
) => {
  if (event.type === 'UPDATE_INDEX' && event.index && event.index < 0) {
    return context.totalSlideCount;
  }
  // Only update activeIndex if index provided is between 0 - totalSlideCount
  if (
    event.type === 'UPDATE_INDEX' &&
    event.index &&
    event.index <= context.totalSlideCount &&
    event.index >= 0
  ) {
    return event.index;
  }

  if (context.activeIndex === context.totalSlideCount) {
    return 0;
  } else {
    return context.activeIndex + 1;
  }
};

const createCarouselMachine = (
  initialContext: CarouselMachineContext = {
    activeIndex: 0,
    totalSlideCount: 5,
    interval: 4000,
  },
) =>
  createMachine<CarouselMachineContext, CarouselMachineEvent>(
    {
      id: 'carouselMachine',
      initial: 'idle',
      context: initialContext,
      states: {
        idle: {
          on: {
            UPDATE_INDEX: {
              actions: ['updateActiveIndex'],
            },
            AUTO_PLAY: 'playing',
          },
        },
        paused: {
          on: {
            AUTO_PLAY: 'playing',
            RESET: {
              target: 'idle',
              actions: ['resetActiveIndex'],
            },
            UPDATE_INDEX: {
              actions: ['updateActiveIndex'],
            },
          },
        },
        playing: {
          invoke: {
            src: 'autoUpdateActiveIndex',
          },
          on: {
            RESET: {
              target: 'idle',
              actions: ['resetActiveIndex'],
            },
            PAUSE: 'paused',
            UPDATE_INDEX: {
              actions: ['updateActiveIndex'],
            },
          },
        },
      },
    },
    {
      actions: {
        resetActiveIndex: assign((context) => {
          return {
            activeIndex: 0,
          };
        }),
        updateActiveIndex: assign({
          activeIndex: (context, event) => calculateNextIndex(context, event),
        }),
      },
      services: {
        autoUpdateActiveIndex: (context) => (cb) => {
          const interval = setInterval(
            () => cb({ type: 'UPDATE_INDEX' }),
            context.interval,
          );

          return () => {
            clearInterval(interval);
          };
        },
      },
    },
  );

export default createCarouselMachine;
