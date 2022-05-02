import FilmsListTitleView from './films-list-title-view.js';
import FilmsListContainerView from './films-list-container-view.js';
import FilmCardView from './film-card-view.js';
import ShowMoreView from './show-more-view.js';
import {createElement, render} from '../render.js';

const createFilmsListTemplate = () => '<section class="films-list"></section>';

export default class FilmsListView {
  filmsListTitleComponent = new FilmsListTitleView();
  filmsListContainerComponent = new FilmsListContainerView();

  _getTemplate() {
    return createFilmsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this._getTemplate());
      render(this.filmsListTitleComponent, this.element);
      render(this.filmsListContainerComponent, this.element);
    }

    return this.element;
  }

  setSectionAdittionClass(adittionClass) {
    this.element.classList.add(adittionClass);
  }

  setTitle(text) {
    this.filmsListTitleComponent.setText(text);
  }

  setTitleAdittionClass(adittionClass) {
    this.filmsListTitleComponent.setAdittionClass(adittionClass);
  }

  addFilmsCards(cardCount) {
    for (let i = 0; i < cardCount; i++) {
      render(new FilmCardView(), this.filmsListContainerComponent.getElement());
    }
  }

  addShowMore() {
    render(new ShowMoreView(), this.element);
  }

  removeElement() {
    this.element = null;
  }
}
