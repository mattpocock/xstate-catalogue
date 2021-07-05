import CheckOutlined from '@material-ui/icons/CheckOutlined';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';
import type * as monaco from 'monaco-editor';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import {
  getCurrentLessonCases,
  lessonMachine,
} from '../../lib/lessons/lessonRunner.machine';
import * as courses from '../../lib/lessons/lessons';
import { CourseType } from '../../lib/lessons/LessonType';
import ReactMarkdown from 'react-markdown';

const Editor = dynamic(import('@monaco-editor/react'), { ssr: false });

export const someValue = 'yes';

export const getStaticPaths: GetStaticPaths = async (context) => {
  const fs = await import('fs');
  const path = await import('path');

  const lessonFolderPath = path.resolve(
    process.cwd(),
    'lib/lessons/lessons/courses',
  );

  const dirs = fs.readdirSync(lessonFolderPath);

  return {
    paths: dirs.map((dir) => {
      return {
        params: {
          lessonId: dir,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const lessonDir = context.params.lessonId;

  const fs = await import('fs');
  const path = await import('path');

  const lessonFolderPath = path.resolve(
    process.cwd(),
    'lib/lessons/lessons/courses',
    lessonDir,
  );

  const markdownFiles: string[] = fs
    .readdirSync(lessonFolderPath)
    .filter((filePath) => filePath.endsWith('.md'))
    .map((file) =>
      fs.readFileSync(path.resolve(lessonFolderPath, file)).toString(),
    );

  return {
    props: {
      markdownFiles,
      id: lessonDir,
    },
  };
};

const LessonDemo = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const course = courses[props.id];

  return <LessonInner course={course} markdownFiles={props.markdownFiles} />;
};

export default LessonDemo;

const LessonInner = (props: {
  course: CourseType;
  markdownFiles: string[];
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);

  const [state, send] = useMachine(lessonMachine, {
    context: {
      course: props.course,
      fileText: props.course.initialMachineText,
    },
    actions: {
      autoFormatEditor: () => {
        editorRef.current.getAction('editor.action.formatDocument').run();
      },
    },
  });

  const cases = getCurrentLessonCases(state.context);

  return (
    <div className="flex items-stretch w-full h-full">
      <div className="flex-shrink-0 p-6 overflow-y-auto prose-sm prose border-r w-80">
        <ReactMarkdown>{`${
          props.markdownFiles[state.context.lessonIndex]
        }`}</ReactMarkdown>
        {state.hasTag('testsPassed') && (
          <button
            onClick={() => send('GO_TO_NEXT_LESSON')}
            className="px-4 py-2 font-semibold text-green-800 bg-green-100 rounded"
          >
            Next Lesson
          </button>
        )}
      </div>
      <div className="flex-1">
        <Editor
          height="400px"
          language="typescript"
          onChange={(text) => {
            send({
              type: 'TEXT_EDITED',
              text,
            });
          }}
          options={{
            tabSize: 2,
            minimap: {
              enabled: false,
            },
          }}
          onMount={async (editor, monaco) => {
            editorRef.current = editor;
            const [indexFile] = await Promise.all([
              fetch(`/xstate.txt`).then((res) => res.text()),
            ]);

            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
              },
            );

            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              `${indexFile}`,
            );
          }}
          value={state.context.fileText}
        />
        <iframe data-xstate height="400px" width="100%" />
      </div>
      <div className="flex-shrink-0 p-6 space-y-10 border-l">
        {cases.map((acceptanceCase, caseIndex) => {
          return (
            <div className="max-w-md space-y-4">
              <h1 className="text-xl font-bold tracking-tight text-gray-800">
                Case #{caseIndex + 1}
              </h1>
              {acceptanceCase.steps.map((step, stepIndex) => {
                const stepTotal = Number(`${caseIndex}.${stepIndex}`);
                const cursorTotal = Number(
                  `${state.context.stepCursor?.case || 0}.${
                    state.context.stepCursor?.step || 0
                  }`,
                );
                let status: 'notComplete' | 'errored' | 'complete' =
                  'notComplete';
                if (
                  state.context.lastErroredStep?.step === stepIndex &&
                  state.context.lastErroredStep?.case === caseIndex
                ) {
                  status = 'errored';
                } else if (
                  state.hasTag('testsPassed') ||
                  stepTotal < cursorTotal
                ) {
                  status = 'complete';
                }
                return (
                  <div
                    className={classNames('font-medium border', {
                      'border-gray-200 text-gray-700 bg-white':
                        status === 'notComplete',
                      'border-green-200 text-green-700 bg-green-100':
                        status === 'complete',
                      'border-red-200 text-red-700 bg-red-100':
                        status === 'errored',
                    })}
                  >
                    <div>
                      <div className="flex items-center p-2 px-3 space-x-3">
                        {status === 'errored' ? (
                          <CloseOutlined />
                        ) : status === 'complete' ? (
                          <CheckOutlined />
                        ) : (
                          <div style={{ width: 24 }} />
                        )}
                        {(step.type === 'ASSERTION' ||
                          step.type === 'OPTIONS_ASSERTION') && (
                          <div>
                            <p className="mb-1">{step.description}</p>
                            <p className="font-mono text-xs opacity-60">
                              {step.assertion.toString().slice(47, -5)}
                            </p>
                          </div>
                        )}
                        {step.type === 'SEND_EVENT' && (
                          <div>
                            <p className="mb-1">
                              Send a {step.event.type} event
                            </p>
                            <p className="font-mono text-xs opacity-60">
                              {JSON.stringify(step.event, null, 1)}
                            </p>
                          </div>
                        )}
                        {step.type === 'WAIT' && (
                          <div>
                            <p>Wait for {step.durationInMs}ms</p>
                            {/* <p className="font-mono text-xs opacity-60">
                              {JSON.stringify(step.event, null, 1)}
                            </p> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* {erroredStep && (
        <div className="p-6 bg-red-100">
          {erroredStep.type === 'ASSERTION' && (
            <p>Error: {erroredStep.description}</p>
          )}
        </div>
      )} */}
    </div>
  );
};
