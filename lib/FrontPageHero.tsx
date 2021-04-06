import { GitHub, ImportContactsOutlined, Twitter } from './Icons';
import css from './FrontPageHero.module.css';

export const FrontPageHero = () => {
  return (
    <div
      className={`px-6 py-12 bg-gray-800 md:py-20 xl:py-36 ${css.backgroundImage}`}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
          <div className="space-y-6 lg:col-span-4">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-widest text-blue-300 uppercase md:text-sm">
                Open for Contributions
              </p>
              <h1 className="text-4xl font-extrabold text-gray-100 md:text-5xl">
                <span className="text-blue-400">Beautiful</span> State Machines
              </h1>
            </div>
            <p className="max-w-lg text-base leading-6 text-gray-200 md:leading-8 md:text-lg">
              XState Catalogue is a collection of professionally designed state
              machines you can drop into your projects. Get started by browsing
              the catalogue, interacting with the machines, and copying the
              code.
            </p>
          </div>
          <div className="flex items-center col-span-2">
            <div className="w-full max-w-xs space-y-3">
              <a
                href="/#Catalogue"
                className="items-center hidden w-full px-6 py-3 pl-5 space-x-4 text-white bg-blue-700 border-2 border-blue-700 rounded lg:flex"
              >
                <ImportContactsOutlined className="w-4 h-4 text-blue-100" />
                <span>Browse the Catalogue</span>
              </a>
              <a
                href="https://github.com/mattpocock/xstate-catalogue"
                className="flex items-center w-full px-6 py-3 pl-5 space-x-4 text-gray-200 bg-gray-800 border-2 border-gray-400 rounded"
                target="_blank"
              >
                <GitHub className="w-4 h-4 text-gray-300" />
                <span>View on GitHub</span>
              </a>
              <a
                href="https://twitter.com/mpocock1"
                className="flex items-center w-full px-6 py-3 pl-5 space-x-4 text-gray-200 bg-gray-800 border-2 border-gray-400 rounded"
                target="_blank"
              >
                <Twitter className="w-4 h-4 text-gray-300" />
                <span>Follow on Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
