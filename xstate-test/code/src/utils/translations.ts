interface ITranslation {
  [key: string]: { translation: string; alternatives?: string[] };
}

const translations: ITranslation = {
  bonjour: {
    translation: 'hello',
  },
  publicité: {
    translation: 'advertising',
    alternatives: ['publicity', 'advertisement'],
  },
};

export default translations;
