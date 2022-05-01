import {createElement} from '../render.js';

const createFilmsListTitleTemplate = () => '<h2 class="films-list__title"></h2>';

export default class FilmsListTitleView {
  _getTemplate() {
    return createFilmsListTitleTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this._getTemplate());
    }

    return this.element;
  }

  addText(text) {
    this.element.textContent = text;
  }

  setAdittionClass(adittionClass) {
    this.element.classList.add(adittionClass);
  }

  removeElement() {
    this.element = null;
  }
}
