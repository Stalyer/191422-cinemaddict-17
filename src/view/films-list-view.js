import {createElement} from '../render.js';

const createFilmsListTemplate = () => '<section class="films-list"></section>';

export default class FilmsListView {
  _getTemplate() {
    return createFilmsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this._getTemplate());
    }

    return this.element;
  }

  setAdittionClass(adittionClass) {
    this.element.classList.add(adittionClass);
  }

  removeElement() {
    this.element = null;
  }
}
