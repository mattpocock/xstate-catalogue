import {
  actions,
  interpret,
  Machine,
  sendParent,
  spawn,
  StateNode,
} from 'xstate';
import { raise } from 'xstate/lib/actions';
import { assign, send } from 'xstate/lib/actionTypes';

export function toMachine(machineText: string): StateNode<any> {
  if (typeof machineText !== 'string') {
    return machineText;
  }

  let makeMachine: Function;
  try {
    makeMachine = new Function(
      'Machine',
      'createMachine',
      'interpret',
      'assign',
      'send',
      'sendParent',
      'spawn',
      'raise',
      'actions',
      machineText,
    );
  } catch (e) {
    throw e;
  }

  const machines: Array<StateNode<any>> = [];

  const machineProxy = (config: any, options: any) => {
    const machine = Machine(config, options);
    machines.push(machine);
    return machine;
  };

  try {
    makeMachine(
      machineProxy,
      machineProxy,
      interpret,
      assign,
      send,
      sendParent,
      spawn,
      raise,
      actions,
    );
  } catch (e) {
    throw e;
  }

  return machines[machines.length - 1]! as StateNode<any>;
}
