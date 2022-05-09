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
  #element = null;
  #sectionSettings = null;
  #filmsItems = [];
  #cardCount = null;
  #showMore = null;

  constructor(sectionSettings) {
    this.#sectionSettings = sectionSettings;
    this.#filmsItems = sectionSettings.filmsItems;
    this.#cardCount = sectionSettings.cardCount;
    this.#showMore = sectionSettings.showMore;
  }

  get template() {
    return createFilmsListTemplate(this.#sectionSettings);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);

      if (this.#filmsItems && this.#cardCount) {
        this.addFilmsCards(this.#filmsItems, this.#cardCount);
      }

      if (this.#showMore) {
        this.addShowMore();
      }
    }

    return this.#element;
  }

  addFilmsCards(films, cardCount) {
    for (let i = 0; i < cardCount; i++) {
      if (films[i]) {
        render(new FilmCardView(films[i]), this.#element.querySelector('.films-list__container'));
      } else {
        break;
      }
    }
  }

  addShowMore() {
    render(new ShowMoreView(), this.#element);
  }

  removeElement() {
    this.#element = null;
  }
}
