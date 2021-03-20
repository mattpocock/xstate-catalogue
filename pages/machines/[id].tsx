import { inspect } from "@xstate/inspect";
import { useMachine } from "@xstate/react";
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
} from "../../lib/MachineHelpers";
import Link from "next/link";

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
  const [state, send, service] = useMachine(props.machine, {
    devTools: true,
  });

  return (
    <>
      <div className="flex justify-center">
        <div className="">
          <div className="flex">
            <MachineHelpersContext.Provider value={{ service }}>
              <div className="border-r p-6 space-y-16 hidden md:block">
                <div className="w-48" />
                <Link href="/">
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
                            {props.machine.getStateNodeById(id).key}
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
                <MDXProvider components={{ Event, State, Action, Service }}>
                  <props.mdxDoc></props.mdxDoc>
                </MDXProvider>
              </div>
            </MachineHelpersContext.Provider>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <div className="bg-gray-800 text-white p-12 -mb-20">
          <div className="container max-w-6xl mx-auto">
            <pre>{props.fileText}</pre>
          </div>
        </div>
      </div>
    </>
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
    paths: machines.map((fileName) => {
      return {
        params: {
          id: fileName.replace(machinePathRegex, ""),
        },
      };
    }),
  };
};

export default MachinePage;
