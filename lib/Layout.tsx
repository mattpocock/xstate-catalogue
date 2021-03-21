import React from "react";
import Link from "next/link";
import packageJson from "../package.json";

export const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <nav className="flex justify-between px-6 border-b h-12 items-center">
        <Link href="/">
          <a>
            <p className="tracking-tight font-bold text-gray-700">
              XState{" "}
              <span className="font-light tracking-tighter">Catalogue</span>
            </p>
          </a>
        </Link>
        <p className="text-gray-400 text-sm font-semibold">
          v{packageJson.version}
        </p>
      </nav>
      <main className="pb-20">{children}</main>
      <footer className="bg-gray-100 p-12">
        <p className="text-gray-600 text-center">
          Built by Matt Pocock. Say hello on{" "}
          <a
            href="https://twitter.com/mpocock1"
            className="underline font-bold"
            target="_blank"
            rel="nofollow"
          >
            Twitter
          </a>
        </p>
      </footer>
    </div>
  );
};
