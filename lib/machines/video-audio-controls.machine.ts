import { assign, createMachine, Sender } from 'xstate';

export interface AudioVideoMachineContext {
  volume: number;
  rate: number;
  muted: boolean;
  loop: boolean;
}

export type AudioVideoVolumeEvent = {
  type: 'VOLUME';
  volume: number;
};

export type AudioVideoRateEvent = {
  type: 'RATE';
  rate: number;
};

export type AudioVideoMachineEvent =
  | {
      type: 'LOAD';
    }
  | {
      type: 'ERROR';
    }
  | {
      type: 'READY';
    }
  | {
      type: 'PAUSE';
    }
  | {
      type: 'PLAY';
    }
  | {
      type: 'RELOAD';
    }
  | {
      type: 'END';
    }
  | {
      type: 'MUTE';
    }
  | AudioVideoVolumeEvent
  | AudioVideoRateEvent
  | {
      type: 'LOOP';
    }
  | {
      type: 'RETRY';
    };

const audioVideoMachine = createMachine<
  AudioVideoMachineContext,
  AudioVideoMachineEvent
>(
  {
    id: 'audio',
    initial: 'idle',
    context: {
      volume: 0.5,
      rate: 1.0,
      muted: false,
      loop: false,
    },
    states: {
      idle: {
        on: {
          LOAD: 'loading',
          ERROR: 'error',
        },
      },
      loading: {
        on: {
          READY: 'ready',
          ERROR: 'error',
        },
      },
      ready: {
        initial: 'playing',
        states: {
          playing: {
            on: {
              PAUSE: 'paused',
            },
          },
          paused: {
            on: {
              PLAY: 'playing',
            },
          },
        },
        on: {
          RELOAD: 'loading',
          END: 'ended',
          ERROR: 'error',
          MUTE: {
            target: '',
            actions: 'onMute',
          },
          LOOP: {
            target: '',
            actions: 'onLoop',
          },
          VOLUME: {
            target: '',
            actions: 'onVolume',
          },
          RATE: {
            target: '',
            actions: 'onRate',
          },
        },
      },
      ended: {
        on: {
          RELOAD: 'loading',
          PLAY: 'ready',
        },
      },
      error: {
        on: {
          RETRY: 'loading',
        },
      },
    },
  },
  {
    actions: {
      onVolume: assign<AudioVideoMachineContext, AudioVideoMachineEvent>({
        volume: (_, event) => (event as AudioVideoVolumeEvent).volume,
      }),
      onRate: assign<AudioVideoMachineContext, AudioVideoMachineEvent>({
        rate: (_, event) => (event as AudioVideoRateEvent).rate,
      }),
      onMute: assign<AudioVideoMachineContext, AudioVideoMachineEvent>({
        muted: (context) => !context.muted,
      }),
      onLoop: assign<AudioVideoMachineContext, AudioVideoMachineEvent>({
        loop: (context) => !context.loop,
      }),
    },
  },
);

export default audioVideoMachine;
