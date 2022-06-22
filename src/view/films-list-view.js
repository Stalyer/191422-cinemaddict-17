import AbstractView from '../framework/view/abstract-view.js';

const SECTION_CLASS = {
  common: {
    titleAdditionClass: ' visually-hidden',
    sectionAddittionClass: '',
  },
  extra: {
    titleAdditionClass: '',
    sectionAddittionClass: ' films-list--extra',
  },
  empty: {
    titleAdditionClass: '',
    sectionAddittionClass: '',
  }
};

const createFilmsListTemplate = (sectionSettings) => {
  const {typeSection, title} = sectionSettings;
  const {titleAdditionClass, sectionAddittionClass} = SECTION_CLASS[typeSection];

  return `<section class="films-list${sectionAddittionClass}">
            <h2 class="films-list__title${titleAdditionClass}">${title}</h2>
            ${typeSection !== 'empty' ? '<div class="films-list__container"></div>' : ''}
          </section>`;
};

export default class FilmsListView extends AbstractView {
  #sectionSettings = null;

  constructor(sectionSettings) {
    super();
    this.#sectionSettings = sectionSettings;
  }

  get template() {
    return createFilmsListTemplate(this.#sectionSettings);
  }

  get containerNode() {
    return this.element.querySelector('.films-list__container');
  }
}
