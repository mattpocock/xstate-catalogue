import Link from "next/link";
import React from "react";

const Wrapper: React.FC<{ title: string }> = (props) => {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl tracking-tight font-bold">{props.title}</h1>
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

const Item: React.FC<{ title: string; href: string; icon: string }> = (
  props,
) => {
  return (
    <Link href={props.href || "/"}>
      <a className="block space-y-2">
        <div className="border p-8 bg-gray-100 flex items-center justify-center">
          <span className="text-5xl">{props.icon || "💡"}</span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600">{props.title}</h3>
        {props.children}
      </a>
    </Link>
  );
};

export const CategoryList = {
  Wrapper,
  Section,
  Item,
};
