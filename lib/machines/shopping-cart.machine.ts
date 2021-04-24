import { createMachine, Sender } from 'xstate';
import { assign } from '@xstate/immer';

export interface ShoppingCartMachineContext {
  items: {
    [id: string]: {
      item: Item;
      quantity: number;
    };
  };
}

export interface Item {
  id: string;
  name: string;
}

export type ShoppingCartMachineEvent =
  | {
      type: 'ADD_TO_CART';
      item: Item;
    }
  | {
      type: 'REMOVE_FROM_CART';
      itemId: string;
    };

const shoppingCartMachine = createMachine<
  ShoppingCartMachineContext,
  ShoppingCartMachineEvent
>(
  {
    id: 'shoppingCart',
    context: {
      items: {},
    },
    on: {
      ADD_TO_CART: {
        actions: 'addItemToCart',
      },
      REMOVE_FROM_CART: {
        actions: 'removeItemFromCart',
      },
    },
    initial: 'idle',
    states: {
      idle: {},
    },
  },
  {
    actions: {
      addItemToCart: assign((context, event) => {
        if (event.type !== 'ADD_TO_CART') return {};

        const existingItem = context.items[event.item.id];
        if (!existingItem) {
          context.items[event.item.id] = {
            item: event.item,
            quantity: 1,
          };
        } else {
          context.items[event.item.id].quantity += 1;
        }
      }),
      removeItemFromCart: assign((context, event) => {
        if (event.type !== 'REMOVE_FROM_CART') return {};

        const existingItem = context.items[event.itemId];

        if (!existingItem) return {};

        if (existingItem.quantity === 1) {
          delete context.items[event.itemId];
          return;
        }

        context.items[event.itemId].quantity -= 1;
      }),
    },
  },
);

export default shoppingCartMachine;
