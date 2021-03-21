import { inspect } from "@xstate/inspect";
import { useInterpret, useMachine } from "@xstate/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Machine, StateMachine } from "xstate";
import { MDXProvider } from "@mdx-js/react";
import {
  MachineHelpersContext,
  State,
  Event,
  Action,
  Service,
  Context,
} from "../../lib/MachineHelpers";
import Link from "next/link";
import Head from "next/head";
import { useCopyToClipboard } from "../../lib/useCopyToClipboard";

interface Props {
  slug: string;
  fileText: string;
}

const useGetImports = (slug: string) => {
  const [imports, setImports] = useState<{
    machine: StateMachine<any, any, any>;
    mdxDoc: any;
  }>();

  const getMachine = async () => {
    const machineImport: {
      default: StateMachine<any, any, any>;
    } = await import(`../../lib/machines/${slug}.machine.ts`);

    const mdxDoc = await import(`../../lib/machines/${slug}.mdx`);

    setImports({
      machine: machineImport.default,
      mdxDoc: mdxDoc.default,
    });
  };

  useEffect(() => {
    getMachine();
  }, [slug]);

  return imports;
};

const MachinePage: NextPage<Props> = (props) => {
  const imports = useGetImports(props.slug);

  const iframeRef = useRef(null);
  useEffect(() => {
    inspect({
      iframe: () => iframeRef.current,
    });
  }, []);

  return (
    <>
      <Head>
        <title>XState Catalogue | {props.slug}</title>
      </Head>
      <iframe
        ref={iframeRef}
        height="601px"
        className="w-full hidden md:block mb-16"
      />
      {imports && (
        <ShowMachinePage
          machine={imports.machine}
          mdxDoc={imports.mdxDoc}
          fileText={props.fileText}
        ></ShowMachinePage>
      )}
    </>
  );
};

const ShowMachinePage = (props: {
  machine: StateMachine<any, any, any>;
  mdxDoc: any;
  fileText: string;
}) => {
  const service = useInterpret(props.machine, {
    devTools: true,
  });
  const [hasDismissed, setHasDismissed] = useState<boolean>(
    Boolean(localStorage.getItem("REJECTED_1")),
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
    <MachineHelpersContext.Provider value={{ service }}>
      <div className="flex justify-center">
        <div className="">
          {!hasDismissed && (
            <div className="flex justify-center mb-16">
              <div className="max-w-xl bg-gray-50 text-gray-600 p-6 space-y-4 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">💡</span>
                  <span className="text-xl font-semibold tracking-tighter">
                    By the way!
                  </span>
                </div>
                <p className="leading- text-gray-500">
                  You can interact with the state machine in the article below
                  by pressing on the <Event>EVENT</Event> buttons. They'll show
                  up as yellow when they can be interacted with.
                </p>
                <button
                  className="absolute top-0 right-0 mb-2 mr-4 p-2 text-lg"
                  onClick={() => {
                    setHasDismissed(true);
                    localStorage.setItem("REJECTED_1", "true");
                  }}
                >
                  <span className="text-gray-600">✖</span>
                </button>
              </div>
            </div>
          )}
          <div className="flex">
            <div className="border-r p-6 space-y-16 hidden md:block">
              <div className="w-48" />
              <Link href="/#Catalogue">
                <a className="text-gray-600 text-base space-x-3">
                  <span className="text-gray-500">{"❮"}</span>
                  <span>Back to List</span>
                </a>
              </Link>
              <div className="space-y-3">
                <h2 className="text-base tracking-tighter text-gray-500 font-semibold">
                  States
                </h2>
                <ul className="space-y-3">
                  {props.machine.stateIds.map((id) => {
                    if (id === props.machine.id) return null;
                    return (
                      <li>
                        <State>
                          {props.machine.getStateNodeById(id).path.join(".")}
                        </State>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="space-y-3">
                <h2 className="text-base tracking-tighter text-gray-500 font-semibold">
                  Events
                </h2>
                <ul className="space-y-3">
                  {props.machine.events
                    .filter((event) => !event.startsWith("xstate."))
                    .map((event) => {
                      return (
                        <li>
                          <Event>{event}</Event>
                        </li>
                      );
                    })}
                </ul>
              </div>
              {Object.keys(props.machine.options.actions).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-base tracking-tighter text-gray-500 font-semibold">
                    Actions
                  </h2>
                  <ul className="space-y-3">
                    {Object.keys(props.machine.options.actions).map(
                      (action) => {
                        return (
                          <li>
                            <Action>{action}</Action>
                          </li>
                        );
                      },
                    )}
                  </ul>
                </div>
              )}
              {Object.keys(props.machine.options.guards).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-base tracking-tighter text-gray-500 font-semibold">
                    Guards
                  </h2>
                  <ul className="space-y-3">
                    {Object.keys(props.machine.options.guards).map((action) => {
                      return (
                        <li>
                          <Action>{action}</Action>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {Object.keys(props.machine.options.services).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-base tracking-tighter text-gray-500 font-semibold">
                    Services
                  </h2>
                  <ul className="space-y-3">
                    {Object.keys(props.machine.options.services).map(
                      (service) => {
                        return (
                          <li>
                            <Service>{service}</Service>
                          </li>
                        );
                      },
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="prose lg:prose-lg p-6">
              <MDXProvider
                components={{ Event, State, Action, Service, Context }}
              >
                <props.mdxDoc></props.mdxDoc>
              </MDXProvider>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <div className="bg-gray-900 text-gray-100 p-12 -mb-20">
          <div className="container max-w-6xl mx-auto relative">
            <pre>
              <code ref={fileTextRef} className="lang-ts">
                {props.fileText}
              </code>
            </pre>
            <button
              className="absolute top-0 right-0 mr-8 bg-blue-700 rounded-lg text-gray-100 px-6 py-3 tracking-tight font-bold"
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

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const fs = await import("fs");
  const path = await import("path");

  const machinesPath = path.resolve(
    process.cwd(),
    "lib/machines",
    `${params.id}.machine.ts`,
  );

  return {
    props: {
      slug: params.id as string,
      fileText: fs.readFileSync(machinesPath).toString(),
    },
  };
};

const machinePathRegex = /\.machine\.ts$/;

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = await import("fs");
  const path = await import("path");

  const machinesPath = path.resolve(process.cwd(), "lib/machines");

  const machines = fs.readdirSync(machinesPath);

  return {
    fallback: false,
    paths: machines
      .filter((machine) => machine.endsWith(".ts"))
      .map((fileName) => {
        return {
          params: {
            id: fileName.replace(machinePathRegex, ""),
          },
        };
      }),
  };
};

export default MachinePage;
