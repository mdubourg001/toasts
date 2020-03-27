import * as React from 'react';
import { State } from 'xstate';

import { IContext, IEvent } from '../machine/machine';

interface IProps {
  state: State<IContext, IEvent, any, any>;
}

export default ({ state }: IProps) => (
  <div className="container mx-auto flex xl:w-3/5">
    <div className="w-1/2 border-r border-gray-700 text-center flex flex-col items-center">
      <small className="text-gray-600">Value</small>
      <hr />
      <span className="text-2xl mt-4">"{state.value}"</span>
    </div>

    <div className="w-1/2 text-center flex flex-col items-center">
      <small className="text-gray-600">Context</small>
      <hr />
      <small className="text-2xl mt-4">
        <small className="text-gray-600 text-xs">source:</small> "{state.context.source}"
      </small>
      <small className="text-2xl">
        <small className="text-gray-600 text-xs">translation:</small> "{state.context.translation}"
      </small>
      <small className="text-2xl">
        <small className="text-gray-600 text-xs">alternatives:</small> [
        {state.context.alternatives.join(', ')}]
      </small>
      <small className="text-2xl">
        <small className="text-gray-600 text-xs">showAlternatives:</small>{' '}
        {state.context.showAlternatives ? 'true' : 'false'}
      </small>
      <small className="text-2xl">
        <small className="text-gray-600 text-xs">translationsMade:</small>{' '}
        {state.context.translationsMade}
      </small>
    </div>
  </div>
);
