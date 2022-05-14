import AbstractView from '../framework/view/abstract-view.js';

const createShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreView extends AbstractView {
  get template() {
    return createShowMoreTemplate();
  }

  setOnClick = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onClick);
  };

  #onClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
