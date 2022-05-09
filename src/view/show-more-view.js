import {createElement} from '../render.js';

const createShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreView {
  #element = null;

  get template() {
    return createShowMoreTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
