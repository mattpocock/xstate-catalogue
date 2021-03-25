import Link from "next/link";
import React from "react";
import packageJson from "../package.json";

const Wrapper: React.FC<{ title: string }> = (props) => {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight" id={props.title}>
          {props.title}
        </h1>
        <hr />
      </div>
      {props.children}
    </div>
  );
};

const Section: React.FC<{ title: string }> = (props) => {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-4 sm:col-span-1">
        <h2 className="text-xl font-semibold tracking-tight text-gray-800">
          {props.title}
        </h2>
      </div>
      <div className="grid grid-cols-1 col-span-4 gap-6 sm:col-span-3 sm:grid-cols-2 lg:grid-cols-3 gap-y-10">
        {props.children}
      </div>
    </div>
  );
};

const Item: React.FC<{
  title: string;
  href: string;
  icon: string;
  version: string;
}> = (props) => {
  const isNew = props.version === packageJson.version;
  return (
    <Link href={props.href || "/"}>
      <a className="relative block">
        <div className="space-y-2">
          <div className="flex items-center justify-center p-8 bg-gray-100 border">
            <span className="text-5xl">{props.icon || "💡"}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">{props.title}</h3>
          {props.children}
        </div>
        {isNew && (
          <span className="absolute top-0 right-0 flex justify-center w-12 px-2 py-1 mt-2 mr-2 text-xs tracking-widest text-white bg-blue-600 rounded shadow">
            <span>NEW</span>
          </span>
        )}
      </a>
    </Link>
  );
};

const ComingSoonItem: React.FC<{
  title: string;
  icon: string;
  version: string;
}> = (props) => {
  return (
    <div className="relative block">
      <div className="space-y-2">
        <div className="flex items-center justify-center p-8 bg-gray-100 border">
          <span className="text-5xl">{props.icon || "💡"}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600">{props.title}</h3>
        {props.children}
      </div>
      <span className="absolute top-0 right-0 flex justify-center w-12 px-2 py-1 mt-2 mr-2 text-xs tracking-widest text-white uppercase bg-gray-700 rounded shadow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </span>
    </div>
  );
};

export const CategoryList = {
  Wrapper,
  Section,
  Item,
  ComingSoonItem,
};
