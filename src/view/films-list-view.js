import FilmCardView from './film-card-view.js';
import ShowMoreView from './show-more-view.js';
import {createElement, render} from '../render.js';

const SECTION_CLASS = {
  common: {
    titleAdittionClass: ' visually-hidden',
    sectionAdittionClass: '',
  },
  extra: {
    titleAdittionClass: '',
    sectionAdittionClass: ' films-list--extra',
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
  constructor(sectionSettings) {
    this.sectionSettings = sectionSettings;
    this.cardCount = sectionSettings.cardCount;
    this.showMore = sectionSettings.showMore;
  }

  _getTemplate() {
    return createFilmsListTemplate(this.sectionSettings);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this._getTemplate());

      if (this.cardCount) {
        this.addFilmsCards(this.cardCount);
      }

      if (this.showMore) {
        this.addShowMore();
      }
    }

    return this.element;
  }

  addFilmsCards(cardCount) {
    for (let i = 0; i < cardCount; i++) {
      render(new FilmCardView(), this.element.querySelector('.films-list__container'));
    }
  }

  addShowMore() {
    render(new ShowMoreView(), this.element);
  }

  removeElement() {
    this.element = null;
  }
}
