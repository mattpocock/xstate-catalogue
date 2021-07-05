import { EventObject, MachineOptions, State } from 'xstate';

export interface CourseType {
  title: string;
  initialMachineText: string;
  lessons: LessonType[];
}
export interface LessonType<TContext = any, TEvent extends EventObject = any> {
  acceptanceCriteria: AcceptanceCriteria<TContext, TEvent>;
  mergeWithPreviousCriteria?: boolean;
}

export interface AcceptanceCriteria<TContext, TEvent extends EventObject> {
  cases: AcceptanceCriteriaCase<TContext, TEvent>[];
}

export interface AcceptanceCriteriaCase<
  TContext = any,
  TEvent extends EventObject = any
> {
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
      type: 'OPTIONS_ASSERTION';
      description: string;
      assertion: (options: MachineOptions<TContext, TEvent>) => boolean;
    }
  | {
      type: 'SEND_EVENT';
      event: TEvent;
    }
  | {
      type: 'WAIT';
      durationInMs: number;
    };
