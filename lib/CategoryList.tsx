import Link from "next/link";
import React from "react";
import packageJson from "../package.json";

const Wrapper: React.FC<{ title: string }> = (props) => {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl tracking-tight font-bold" id={props.title}>
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
        <h2 className="text-xl text-gray-800 font-semibold tracking-tight">
          {props.title}
        </h2>
      </div>
      <div className="col-span-4 sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
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
      <a className="block relative">
        <div className="space-y-2">
          <div className="border p-8 bg-gray-100 flex items-center justify-center">
            <span className="text-5xl">{props.icon || "💡"}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">{props.title}</h3>
          {props.children}
        </div>
        {isNew && (
          <span className="top-0 right-0 absolute bg-blue-600 text-xs tracking-widest text-white rounded px-2 py-1 mt-2 mr-2 shadow">
            NEW
          </span>
        )}
      </a>
    </Link>
  );
};

export const CategoryList = {
  Wrapper,
  Section,
  Item,
};
