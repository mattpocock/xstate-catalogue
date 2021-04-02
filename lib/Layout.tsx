import React from "react";
import Link from "next/link";
import packageJson from "../package.json";
import { useRouter } from "next/router";
import { globalStateService, useLayout } from "./GlobalState";

export const Layout: React.FC = ({ children }) => {
  const router = useRouter();

  const shouldPreventScroll = router.pathname.includes("/machines/[id]");

  const layout = useLayout();

  return (
    <div
      className="grid h-screen grid-rows-2"
      style={{
        gridTemplateRows: `50px 1fr`,
      }}
    >
      <nav className="flex items-center justify-between flex-grow-0 flex-shrink-0 px-6 border-b">
        <Link href="/">
          <a>
            <p className="font-bold tracking-tight text-gray-700">
              XState{" "}
              <span className="font-light tracking-tighter">Catalogue</span>
            </p>
          </a>
        </Link>
        <div className="items-center hidden space-x-6 md:flex">
          {router.pathname.includes("machines") && (
            <button
              onClick={() => globalStateService.send("TOGGLE_LAYOUT")}
              className="px-2 py-1 text-gray-400"
            >
              {layout === "horizontal" && (
                <svg
                  className="w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  key="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              )}
              {layout === "vertical" && (
                <svg
                  className="w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  key="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              )}
              {layout === "blog" && (
                <svg
                  className="w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  key="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          )}
          <a
            className="text-sm font-semibold text-gray-400"
            href="https://github.com/mattpocock/xstate-catalogue"
            target="_blank"
            title="XState Catalogue GitHub"
          >
            v{packageJson.version}
          </a>
        </div>
      </nav>
      <div className={shouldPreventScroll ? "overflow-hidden" : ""}>
        {children}
      </div>
      {/* <main className="pb-20">{children}</main> */}
      {/* <footer className="p-12 bg-gray-100">
        <p className="text-center text-gray-600">
          Built by Matt Pocock. Say hello on{" "}
          <a
            href="https://twitter.com/mpocock1"
            className="font-bold underline"
            target="_blank"
            rel="nofollow"
          >
            Twitter
          </a>
        </p>
      </footer> */}
    </div>
  );
};
