import Link from 'next/link';
import React from 'react';
import packageJson from '../package.json';
import * as Icons from '../lib/Icons';
import { metadata } from './metadata';

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
  id: string;
}> = (props) => {
  const meta = metadata[props.id];

  if (!meta) throw new Error('Could not find metadata for ' + props.id);

  const isNew = meta.version === packageJson.version;

  const Icon = Icons[meta.icon];

  return (
    <Link href={`/machines/${props.id}`}>
      <a className="relative block">
        <div className="space-y-2">
          <div className="flex items-center justify-center h-32 bg-gray-100 border rounded">
            <Icon
              style={{ width: '60px', height: '60px' }}
              className="text-gray-600 fill-current"
            ></Icon>
          </div>
          <h3 className="text-sm font-semibold text-gray-600">{meta.title}</h3>
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
  icon: React.FC<any>;
}> = (props) => {
  return (
    <div className="relative block">
      <div className="space-y-2">
        <div className="flex items-center justify-center h-32 bg-gray-100 border rounded">
          <props.icon
            style={{ width: '60px', height: '60px' }}
            className="text-gray-600 fill-current"
          ></props.icon>
        </div>
        <h3 className="text-sm font-semibold text-gray-600">{props.title}</h3>
        {props.children}
      </div>
      <span className="absolute top-0 right-0 flex justify-center px-2 py-1 mt-2 mr-2 text-xs tracking-widest text-white uppercase bg-red-700 rounded shadow">
        SOON
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
