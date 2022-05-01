import {createElement} from '../render.js';

const createFilterTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
   </ul>`
);

export default class FilterView {
  _getTemplate() {
    return createFilterTemplate();
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
