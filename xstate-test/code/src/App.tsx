import * as React from 'react';
import { useMachine } from '@xstate/react';

import { translatorMachine } from './machine/machine';

import Header from './components/Header';

export default () => {
  const [state, send] = useMachine(translatorMachine);

  return (
    <>
      <Header />

      <div className="container mx-auto flex flex-col xl:w-3/5">
        <div className="flex py-12 text-xl">
          <div className="w-1/2 pr-2">
            <textarea
              className="resize-none bg-white rounded-lg shadow-lg w-full transition-shadow duration-200 h-56  p-4 focus:shadow-xl"
              placeholder="Type in text to translate..."
              value={state.context.source}
              onChange={(event) => send({ type: 'SOURCE_CHANGE', source: event.target.value })}
            ></textarea>
          </div>
          <div className="w-1/2 pl-2">
            <textarea
              className="resize-none bg-white rounded-lg shadow-lg transition-shadow duration-200 w-full h-56 p-4 focus:shadow-xl"
              value={state.context.translation}
              disabled
            ></textarea>
          </div>
        </div>

        <button
          className="self-center border px-4 py-2 bg-teal-700 rounded-full shadow-lg text-white font-bold"
          onClick={() => send({ type: 'FETCH_TRANSLATION' })}
        >
          Translate
        </button>
      </div>
    </>
  );
};
