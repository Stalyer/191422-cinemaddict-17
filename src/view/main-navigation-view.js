import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = (filters) => {

  const createFilters = () => {
    let filtersTempalte = '';

    filters.forEach((filter) => {
      const {name, count} = filter;
      if (name !== 'All movies') {
        filtersTempalte += `<a href="#${name.toLowerCase()}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
      }
    });

    return filtersTempalte;
  };

  return `<nav class="main-navigation">
            <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
            ${createFilters()}
          </nav>`;
};

export default class MainNavigationView extends AbstractView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
