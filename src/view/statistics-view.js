import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (filmCount) => {
  filmCount = filmCount ? filmCount.toLocaleString('ru-RU') : 0;
  return `<p>${filmCount} movies inside</p>`;
};

export default class StatisticsView extends AbstractView {
  #filmCount = null;

  constructor(filmCount) {
    super();
    this.#filmCount = filmCount;
  }

  get template() {
    return createStatisticsTemplate(this.#filmCount);
  }
}
