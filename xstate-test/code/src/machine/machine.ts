import { Machine, assign } from 'xstate';

import { tapLog } from '../utils/devUtils';
import translations from '../utils/translations';

// ----- types -----

interface IContext {
  translationsMade: number; // for testing purposes
  source: string;
  translation: string;
  alternatives: string[];
  showAlternatives: boolean;
}

interface IStateSchema {
  states: {
    idle: {};
    fetchTranslation: {};
    failure: {};
  };
}

interface IEvent {
  type: string;
  source?: string;
  translation?: string;
  alternatives?: string[];
}

interface IInvokeResolve extends IEvent {
  data?: any;
}

// ----- services -----

const translate = (context: IContext) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = translations[context.source.toLowerCase()];

      return result
        ? resolve({ translation: result.translation, alternatives: result.alternatives || [] })
        : reject('No match for text to translate.');
    }, 1000);
  });

// ----- guards -----

const isSourceFetchable = (context: IContext) => context.source.length > 0;

// ----- actions -----

const toggleShowAlternatives = (context: IContext) => ({
  ...context,
  showAlternatives: !context.showAlternatives,
});

const clearFields = assign((context: IContext) => ({
  ...context,
  source: '',
  translation: '',
  alternatives: [],
}));

const updateSource = assign((context: IContext, { source }: IEvent) => ({
  ...context,
  source,
  translation: '',
  alternatives: [],
}));

const updateTranslation = assign((context: IContext, { data }: IInvokeResolve) => ({
  ...context,
  translation: data.translation,
  alternatives: data.alternatives,
}));

const incrementTranslationsMade = assign((context: IContext) => ({
  ...context,
  translationsMade: context.translationsMade + 1,
}));

// ----- machine -----

export const translatorMachine = Machine<IContext, IStateSchema, IEvent>(
  {
    id: 'translator',
    initial: 'idle',
    on: {
      TOGGLE_ALT: {
        actions: 'toggleShowAlternatives',
      },
    },
    context: {
      translationsMade: 0, // for testing purposes
      source: '',
      translation: '',
      alternatives: [],
      showAlternatives: false,
    },
    states: {
      idle: {
        on: {
          SOURCE_CHANGE: {
            actions: 'updateSource',
          },
          FETCH_TRANSLATION: [{ target: 'fetchTranslation', cond: 'isSourceFetchable' }],
          CLEAR: {
            actions: 'clearFields',
          },
        },
      },
      fetchTranslation: {
        entry: 'incrementTranslationsMade',
        invoke: {
          src: 'translate',
          onDone: {
            target: 'idle',
            actions: 'updateTranslation',
          },
          onError: 'failure',
        },
      },
      failure: {
        on: {
          CLOSE: {
            target: 'idle',
            actions: 'clearFields',
          },
        },
      },
    },
  },
  {
    actions: {
      toggleShowAlternatives,
      clearFields,
      updateSource,
      updateTranslation,
      incrementTranslationsMade,
    },
    services: {
      translate,
    },
    guards: {
      isSourceFetchable,
    },
  },
);
