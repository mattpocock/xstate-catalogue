import { assign, createMachine, DoneInvokeEvent, Sender } from 'xstate';

export interface PaymentCheckoutMachineContext {
  errorMessage?: string;
}

export type PaymentCheckoutMachineEvent =
  | {
      type: 'PAY_VIA_CARD';
    }
  | {
      type: 'PAY_VIA_PAYPAL';
    }
  | {
      type: 'PAYPAL_SUCCESS';
    }
  | {
      type: 'PAYPAL_FAILURE';
    }
  | {
      type: 'CHOOSE_SHIPPING_INFO';
    }
  | {
      type: 'SKIP';
    }
  | {
      type: 'ADD_COOL_STUFF_TO_CART';
    }
  | {
      type: 'GO_BACK';
    };

const captureErrorMessageInContext = assign(
  (context, event: DoneInvokeEvent<Error>) => {
    return {
      errorMessage: event.data?.message || 'An unknown error occurred',
    };
  },
);

const paymentCheckoutMachine = createMachine<
  PaymentCheckoutMachineContext,
  PaymentCheckoutMachineEvent
>(
  {
    id: 'paymentCheckout',
    initial: 'choosingShippingInformation',
    states: {
      choosingShippingInformation: {
        exit: ['clearErrorMessage'],
        onDone: {
          target: 'showingCoolStuff',
        },
        initial: 'idle',
        states: {
          idle: {
            on: {
              CHOOSE_SHIPPING_INFO: {
                target: 'validating',
              },
            },
          },
          validating: {
            invoke: {
              src: 'validateShippingInfo',
              onDone: {
                target: 'complete',
              },
              onError: {
                target: 'idle',
                actions: [captureErrorMessageInContext],
              },
            },
          },
          complete: {
            type: 'final',
          },
        },
      },
      showingCoolStuff: {
        on: {
          SKIP: [
            {
              cond: 'hasAddedCoolStuffToCart',
              target: 'choosingPaymentMethod',
            },
            {
              target: 'showingCoolStuffAgain',
            },
          ],
          GO_BACK: 'choosingShippingInformation',
          ADD_COOL_STUFF_TO_CART: {
            actions: 'addCoolStuffToCart',
          },
        },
      },
      showingCoolStuffAgain: {
        on: {
          SKIP: 'choosingPaymentMethod',
          GO_BACK: 'choosingShippingInformation',
          ADD_COOL_STUFF_TO_CART: {
            actions: 'addCoolStuffToCart',
          },
        },
      },
      choosingPaymentMethod: {
        on: {
          PAY_VIA_CARD: 'paying.payingViaCard',
          PAY_VIA_PAYPAL: 'paying.payingViaPaypal',
        },
      },
      paying: {
        initial: 'payingViaCard',
        states: {
          payingViaCard: {},
          payingViaPaypal: {
            initial: 'initialisingEmbed',
            states: {
              initialisingEmbed: {
                invoke: {
                  src: 'initialiseEmbed',
                },
              },
              awaitingResponse: {
                meta: {
                  description: `Waiting for the user to complete the embedded PayPal form`,
                },
                on: {
                  PAYPAL_SUCCESS: {},
                  PAYPAL_FAILURE: {},
                },
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      hasAddedCoolStuffToCart: () => {
        return false;
      },
    },
    actions: {
      clearErrorMessage: assign({
        errorMessage: undefined,
      }),
    },
  },
);

export default paymentCheckoutMachine;
