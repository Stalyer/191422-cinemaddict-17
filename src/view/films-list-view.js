// import ShowMoreView from './show-more-view.js';
import {createElement} from '../render.js';

const SECTION_CLASS = {
  common: {
    titleAdittionClass: ' visually-hidden',
    sectionAdittionClass: '',
  },
  extra: {
    titleAdittionClass: '',
    sectionAdittionClass: ' films-list--extra',
  },
  empty: {
    titleAdittionClass: '',
    sectionAdittionClass: '',
  }
};

const createFilmsListTemplate = (sectionSettings) => {
  const {typeSection, title} = sectionSettings;
  const {titleAdittionClass, sectionAdittionClass} = SECTION_CLASS[typeSection];

  return `<section class="films-list${sectionAdittionClass}">
            <h2 class="films-list__title${titleAdittionClass}">${title}</h2>
            <div class="films-list__container"></div>
          </section>`;
};

export default class FilmsListView {
  #element = null;
  #sectionSettings = null;

  constructor(sectionSettings) {
    this.#sectionSettings = sectionSettings;
  }

  get template() {
    return createFilmsListTemplate(this.#sectionSettings);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get containerNode() {
    return this.element.querySelector('.films-list__container');
  }

  removeElement() {
    this.#element = null;
  }
}
