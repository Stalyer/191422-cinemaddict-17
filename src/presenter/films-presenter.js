import FilmsView from '../view/films-view.js';
import FilmsListPresenter from './films-list-presenter.js';
import {render} from '../render.js';

const FILMS_COUNT = {
  main: 5,
  rating: 2,
  commented: 2
};

export default class FilmsPresenter {
  filmsComponent = new FilmsView();

  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    render(this.filmsComponent, this.filmsContainer);
    const filmsListMainComponent = new FilmsListPresenter();
    const filmsListRatingComponent = new FilmsListPresenter();
    const filmsListCommentedComponent = new FilmsListPresenter();

    filmsListMainComponent.init(this.filmsComponent.getElement(), FILMS_COUNT.main, true);
    filmsListMainComponent.addTitleText('All movies. Upcoming');
    filmsListMainComponent.setTitleAdittionClass('visually-hidden');

    filmsListRatingComponent.init(this.filmsComponent.getElement(), FILMS_COUNT.rating);
    filmsListRatingComponent.addTitleText('Top rated');
    filmsListRatingComponent.setListAdittionClass('films-list--extra');

    filmsListCommentedComponent.init(this.filmsComponent.getElement(), FILMS_COUNT.commented);
    filmsListCommentedComponent.addTitleText('Most commented');
    filmsListCommentedComponent.setListAdittionClass('films-list--extra');
  };
}
