import { assign, createMachine, Sender, sendParent } from 'xstate';

type LocalesContext = {
  iterator: number;
  locales: Record<string, unknown>;
  locale: string;
  current: unknown;
};

type LocalesEvents<L extends Record<string, unknown>> =
  | {
      type: 'START';
      locales: Record<string, unknown>;
      defaultLocale: string;
    }
  | { type: 'CHANGE_LANGUAGE'; locale: keyof L };

const localesMachineMachine = createMachine(
  {
    id: 'localesMachine',
    initial: 'idle',
    context: {
      iterator: 0,
      locales: { en: {} },
      locale: 'en',
      current: {},
    },

    schema: {
      context: {} as LocalesContext,
      events: {} as LocalesEvents<LocalesContext['locales']>,
    },

    states: {
      idle: {
        exit: 'inc',
        on: {
          START: {
            actions: 'assignLocales',
            target: 'started',
          },
        },
      },
      started: {
        initial: 'changing',
        states: {
          normal: {
            entry: 'updateParent',
            exit: 'inc',
            on: {
              CHANGE_LANGUAGE: {
                actions: 'changeLocale',
                target: 'changing',
              },
            },
          },
          changing: {
            entry: 'changeCurrent',
            exit: 'inc',
            always: 'normal',
          },
        },
      },
    },
  },
  {
    actions: {
      changeLocale: assign({ locale: (_, { locale }: any) => locale }),
      assignLocales: assign({
        locales: (_, { locales }: any) => locales,
        locale: (_, { locale }: any) => locale,
      }),

      changeCurrent: assign({
        current: (context, { locale }: any) => context.locales[locale],
      }),

      inc: assign({ iterator: (context) => context.iterator + 1 }),

      updateParent: sendParent(({ current, locale }) => ({
        type: 'LOCALES.UPDATE' as const,
        locale,
        current,
      })),
    },
  },
);

export default localesMachineMachine;
