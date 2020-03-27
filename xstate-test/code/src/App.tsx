import * as React from 'react';
import { useMachine } from '@xstate/react';
import cs from 'classnames';

import { translatorMachine } from './machine/machine';

import Header from './components/Header';
import Frown from './components/Frown';
import Spinner from './components/Spinner';
import StateDetails from './components/StateDetails';
import '../index.css';

export default () => {
  const [state, send] = useMachine(translatorMachine);

  return (
    <>
      <Header />

      <div className="container mx-auto flex flex-col xl:w-3/5">
        <div className="flex py-12 text-xl">
          <div className="flex flex-col bg-white rounded-lg w-1/2 mr-2 p-4 shadow-lg">
            <textarea
              className="resize-none flex-1 w-full bg-white"
              placeholder="Type in text to translate..."
              value={state.context.source}
              onChange={(event) => send({ type: 'SOURCE_CHANGE', source: event.target.value })}
              disabled={state.value !== 'idle'}
            ></textarea>
            <button
              className={cs(
                'flex-0 self-end px-6 py-2 rounded-full text-white text-sm',
                state.value === 'failure' ? 'bg-red-700' : 'bg-teal-700',
                { 'opacity-75 cursor-default': state.value === 'fetchTranslation' },
              )}
              onClick={() =>
                state.value === 'failure'
                  ? send({ type: 'CLEAR' })
                  : send({ type: 'FETCH_TRANSLATION' })
              }
              disabled={state.value === 'fetchTranslation'}
            >
              {state.value === 'failure' ? 'Clear' : 'Translate'}
            </button>
          </div>
          <div className="relative flex flex-col bg-white rounded-lg w-1/2 ml-2 p-4 shadow-lg h-56">
            <textarea
              className={cs('resize-none flex-1 w-full bg-white', {
                hidden: state.value === 'failure',
              })}
              value={state.context.translation}
              disabled
            ></textarea>

            <div
              className={cs('h-full w-full flex items-center justify-center', {
                hidden: state.value !== 'failure',
              })}
            >
              <Frown />
            </div>

            <div
              className={cs('h-full w-full flex items-center justify-center', {
                hidden: state.value !== 'fetchTranslation',
              })}
            >
              <Spinner />
            </div>

            <div
              className={cs('flex justify-between items-center', {
                hidden: state.context.alternatives.length === 0,
              })}
            >
              <i className="text-sm text-gray-500 mb-2">Alternatives</i>
              <div
                className={cs(
                  'w-2 h-2 border-r border-b border-gray-500 cursor-pointer',
                  state.context.showAlternatives ? 'chevron-down' : 'chevron-right',
                )}
                onClick={() => send({ type: 'TOGGLE_ALT' })}
              ></div>
            </div>
            <hr className={cs({ hidden: state.context.alternatives.length === 0 })} />
            <ul className={cs({ hidden: !state.context.showAlternatives })}>
              {state.context.alternatives.map((alt, index) => (
                <li key={index} className="pt-1 text-base">
                  <small className="italic text-gray-600">{index + 1}.</small> {alt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <StateDetails state={state} />
    </>
  );
};
