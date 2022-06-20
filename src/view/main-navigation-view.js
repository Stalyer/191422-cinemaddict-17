import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a
      href="#${type}"
      class="main-navigation__item${type === currentFilterType ? ' main-navigation__item--active' : ''}"
      data-filter-type="${type}"
      >
        ${name}
        ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
      </a>`
  );
};

const createNavigationTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
            ${filterItemsTemplate}
          </nav>`;
};

export default class MainNavigationView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor (filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilterType);
  }

  #onfilterTypeClick = (evt) => {
    if (evt.target.tagName === 'A' || evt.target.tagName === 'SPAN') {
      evt.preventDefault();
      const filterType = evt.target.tagName === 'A' ? evt.target.dataset.filterType : evt.target.parentElement.dataset.filterType;
      this._callback.filterTypeClick(filterType);
    }
  };

  setOnFilterTypeClick = (callback) => {
    this._callback.filterTypeClick = callback;
    this.element.addEventListener('click', this.#onfilterTypeClick);
  };
}
