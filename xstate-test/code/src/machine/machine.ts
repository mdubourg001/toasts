import { Machine, assign } from 'xstate';

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
}));

const updateTranslation = assign((context: IContext, { translation, alternatives }: IEvent) => ({
  ...context,
  translation,
  alternatives,
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
          FETCH_TRANSLATION: { target: 'fetchTranslation', actions: 'updateSource' },
          CLEAR: {
            actions: 'clearFields',
          },
        },
      },
      fetchTranslation: {
        entry: 'incrementTranslationsMade',
        invoke: {
          src: () => Promise.resolve(42),
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
  },
);
