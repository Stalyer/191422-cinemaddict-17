import {createElement} from '../render.js';

const createShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreView {
  _getTemplate() {
    return createShowMoreTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this._getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
