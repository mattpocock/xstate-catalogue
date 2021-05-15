import { EventObject, State } from 'xstate';

export interface LessonType<TContext, TEvent extends EventObject> {
  title: string;
  acceptanceCriteria: AcceptanceCriteria<TContext, TEvent>;
}

export interface AcceptanceCriteria<TContext, TEvent extends EventObject> {
  cases: AcceptanceCriteriaCase<TContext, TEvent>[];
}

export interface AcceptanceCriteriaCase<TContext, TEvent extends EventObject> {
  // initialContext?: TContext;
  steps: AcceptanceCriteriaStep<TContext, TEvent>[];
}

export type AcceptanceCriteriaStep<TContext, TEvent extends EventObject> =
  | {
      type: 'ASSERTION';
      description: string;
      assertion: (state: State<TContext, TEvent>) => boolean;
    }
  | {
      type: 'SEND_EVENT';
      event: TEvent;
    };
