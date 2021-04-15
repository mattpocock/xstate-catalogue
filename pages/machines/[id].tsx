import GitHub from '@material-ui/icons/GitHub';
import { MDXProvider } from '@mdx-js/react';
import { inspect } from '@xstate/inspect';
import { useInterpret } from '@xstate/react';
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { StateMachine } from 'xstate';
import { useLayout } from '../../lib/GlobalState';
import {
  Action,
  Context,
  Event,
  Guard,
  MachineHelpersContext,
  MDXMetadata,
  Service,
  State,
  WholeContext,
} from '../../lib/MachineHelpers';
import { metadata, MetadataItem } from '../../lib/metadata';
import { useCopyToClipboard } from '../../lib/useCopyToClipboard';

const useGetImports = (slug: string, deps: any[]) => {
  const [imports, setImports] = useState<{
    machine: StateMachine<any, any, any>;
    mdxDoc: any;
    mdxMetadata?: MDXMetadata;
  }>();

  const getMachine = async () => {
    setImports(undefined);
    const machineImport: {
      default: StateMachine<any, any, any>;
    } = await import(`../../lib/machines/${slug}.machine.ts`);

    const mdxDoc = await import(`../../lib/machines/${slug}.mdx`);

    setImports({
      machine: machineImport.default,
      mdxDoc: mdxDoc.default,
      mdxMetadata: mdxDoc.metadata,
    });
  };

  useEffect(() => {
    getMachine();
  }, [slug, ...deps]);

  return imports;
};

export const getStaticProps = async ({ params }) => {
  const fs = await import('fs');
  const path = await import('path');

  const machinesPath = path.resolve(
    process.cwd(),
    'lib/machines',
    `${params.id}.machine.ts`,
  );

  const meta = metadata[params.id];

  if (!meta) {
    throw new Error(
      `Could not find metadata for ${params.id}. Go to lib/metadata.ts to fix.`,
    );
  }

  return {
    props: {
      slug: params.id as string,
      fileText: fs.readFileSync(machinesPath).toString(),
      meta,
    },
  };
};

const MachinePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props,
) => {
  const layout = useLayout();
  const imports = useGetImports(props.slug, [layout]);

  const iframeRef = useRef(null);
  useEffect(() => {
    const { disconnect } = inspect({
      iframe: () => iframeRef.current,
    });

    return () => {
      disconnect();
    };
  }, [layout, props.slug]);

  return (
    <>
      <Head>
        <title>{props.meta.title} | XState Catalogue</title>
      </Head>
      <Layout
        content={
          <>
            {imports && (
              <ShowMachinePage
                slug={props.slug}
                machine={imports.machine}
                mdxDoc={imports.mdxDoc}
                fileText={props.fileText}
                meta={props.meta}
                mdxMetadata={imports.mdxMetadata}
              ></ShowMachinePage>
            )}
          </>
        }
        iframe={
          <iframe key="iframe" ref={iframeRef} className="w-full h-full" />
        }
      ></Layout>
    </>
  );
};

const Layout = (props: {
  content: React.ReactNode;
  iframe: React.ReactNode;
}) => {
  const layout = useLayout();
  if (layout === 'horizontal' || layout === 'vertical') {
    return (
      <div
        className={`md:grid h-full ${
          layout === 'horizontal' ? 'md:grid-cols-2' : 'md:grid-rows-2'
        }`}
      >
        <div className="hidden bg-black md:block">{props.iframe}</div>
        <div className="overflow-y-scroll md:pt-12">
          <div>{props.content}</div>
        </div>
      </div>
    );
  }
  if (layout === 'blog') {
    return (
      <div className="h-full overflow-y-scroll">
        <div>
          <div
            style={{ height: '550px' }}
            className="hidden mb-16 bg-black md:block"
          >
            {props.iframe}
          </div>
          <div>{props.content}</div>
        </div>
      </div>
    );
  }

  return null;
};

const ShowMachinePage = (props: {
  machine: StateMachine<any, any, any>;
  mdxDoc: any;
  fileText: string;
  slug: string;
  meta: MetadataItem;
  mdxMetadata?: MDXMetadata;
}) => {
  const service = useInterpret(props.machine, {
    devTools: true,
  });
  const [hasDismissed, setHasDismissed] = useState<boolean>(
    Boolean(localStorage.getItem('REJECTED_1')),
  );

  const copyToClipboard = useCopyToClipboard({});

  const fileTextRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    const hljs: any = window.hljs;
    if (hljs) {
      hljs.highlightBlock(fileTextRef.current);
    }
  }, [fileTextRef, props.fileText]);

  return (
    <MachineHelpersContext.Provider
      value={{ service, metadata: props.mdxMetadata }}
    >
      <div className="flex justify-center">
        <div className="">
          {!hasDismissed && (
            <div className="flex justify-center mb-16">
              <div className="relative max-w-xl p-6 space-y-4 text-gray-600 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">💡</span>
                  <span className="text-xl font-semibold tracking-tighter">
                    By the way!
                  </span>
                </div>
                <p className="text-gray-500 leading-">
                  You can interact with the state machine in the article below
                  by pressing on the <Event>EVENT</Event> buttons. They'll show
                  up as yellow when they can be interacted with.
                </p>
                <button
                  className="absolute top-0 right-0 p-2 mb-2 mr-4 text-lg"
                  onClick={() => {
                    setHasDismissed(true);
                    localStorage.setItem('REJECTED_1', 'true');
                  }}
                >
                  <span className="text-gray-600">✖</span>
                </button>
              </div>
            </div>
          )}
          <div className="flex">
            <SideBar machine={props.machine} />
            <div className="p-6 space-y-6">
              <div className="space-x-4 text-xs font-medium tracking-tight text-gray-500">
                <a
                  href={`https://github.com/mattpocock/xstate-catalogue/edit/master/lib/machines/${props.slug}.machine.ts`}
                  className="inline-flex items-center px-2 py-1 pr-1 space-x-2 text-gray-500 border border-gray-200 rounded"
                  target="_blank"
                >
                  <span>Edit</span>
                  <GitHub style={{ height: '1rem', width: '1.2rem' }} />
                </a>
                <a
                  href={`https://github.com/mattpocock/xstate-catalogue/discussions?discussions_q=${props.meta.title}`}
                  className="inline-flex items-center px-2 py-1 pr-1 space-x-2 text-gray-500 border border-gray-200 rounded"
                  target="_blank"
                >
                  <span>Discuss</span>
                  <GitHub style={{ height: '1rem', width: '1.2rem' }} />
                </a>
              </div>
              <div className="prose lg:prose-lg">
                <MDXProvider
                  components={{
                    Event,
                    State,
                    Action,
                    Service,
                    Context,
                    WholeContext,
                  }}
                >
                  <props.mdxDoc></props.mdxDoc>
                </MDXProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <div className="p-6 xl:p-12 -mb-20 text-gray-100 bg-gray-900">
          <div className="container relative max-w-6xl mx-auto">
            <pre>
              <code ref={fileTextRef} className="lang-ts">
                {props.fileText}
              </code>
            </pre>
            <button
              className="invisible md:visible absolute top-0 right-0 px-6 py-3 mr-8 font-bold tracking-tight text-gray-100 bg-blue-700 rounded-lg"
              onClick={() => {
                copyToClipboard(props.fileText);
              }}
            >
              Copy To Clipboard
            </button>
          </div>
        </div>
      </div>
    </MachineHelpersContext.Provider>
  );
};

const machinePathRegex = /\.machine\.ts$/;

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = await import('fs');
  const path = await import('path');

  const machinesPath = path.resolve(process.cwd(), 'lib/machines');

  const machines = fs.readdirSync(machinesPath);

  return {
    fallback: false,
    paths: machines
      .filter((machine) => machine.endsWith('.ts'))
      .map((fileName) => {
        return {
          params: {
            id: fileName.replace(machinePathRegex, ''),
          },
        };
      }),
  };
};

export default MachinePage;

const SideBar = (props: { machine: StateMachine<any, any, any> }) => {
  return (
    <div
      className="hidden p-6 space-y-16 border-r md:block"
      style={{ maxWidth: '300px' }}
    >
      <div className="w-48" />
      <Link href="/#Catalogue">
        <a className="space-x-3 text-base text-gray-600">
          <span className="text-gray-500">{'❮'}</span>
          <span>Back to List</span>
        </a>
      </Link>
      <div className="space-y-3">
        <h2 className="text-base font-semibold tracking-tighter text-gray-500">
          States
        </h2>
        <ul className="space-y-3">
          {props.machine.stateIds.map((id) => {
            if (id === props.machine.id) return null;
            return (
              <li key={`MACHINE ID: ${id}`}>
                <State>
                  {props.machine.getStateNodeById(id).path.join('.')}
                </State>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="space-y-3">
        <h2 className="text-base font-semibold tracking-tighter text-gray-500">
          Events
        </h2>
        <ul className="space-y-3">
          {props.machine.events
            .filter((event) => !event.startsWith('xstate.') && event)
            .map((event) => {
              return (
                <li key={`EVENT TYPE: ${event}`}>
                  <Event>{event}</Event>
                </li>
              );
            })}
        </ul>
      </div>
      {Object.keys(props.machine.options.actions).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tighter text-gray-500">
            Actions
          </h2>
          <ul className="space-y-3">
            {Object.keys(props.machine.options.actions).map((action) => {
              return (
                <li key={`ACTION: ${action}`}>
                  <Action>{action}</Action>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {Object.keys(props.machine.options.guards).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tighter text-gray-500">
            Guards
          </h2>
          <ul className="space-y-3">
            {Object.keys(props.machine.options.guards).map((guard) => {
              return (
                <li key={`GUARD: ${guard}`}>
                  <Guard>{guard}</Guard>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {Object.keys(props.machine.options.services).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tighter text-gray-500">
            Services
          </h2>
          <ul className="space-y-3">
            {Object.keys(props.machine.options.services).map((service) => {
              return (
                <li key={`SERVICE: ${service}`}>
                  <Service>{service}</Service>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
