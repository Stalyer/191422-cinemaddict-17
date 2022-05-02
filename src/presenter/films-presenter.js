import FilmsView from '../view/films-view.js';
import FilmsListView from '../view/films-list-view.js';
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
    const filmsListMainComponent = new FilmsListView();
    const filmsListRatingComponent = new FilmsListView();
    const filmsListCommentedComponent = new FilmsListView();

    filmsListMainComponent.getElement();
    filmsListMainComponent.setTitle('All movies. Upcoming');
    filmsListMainComponent.setTitleAdittionClass('visually-hidden');
    filmsListMainComponent.addFilmsCards(FILMS_COUNT.main);
    filmsListMainComponent.addShowMore();
    render(filmsListMainComponent, this.filmsComponent.getElement());

    filmsListRatingComponent.getElement();
    filmsListRatingComponent.setTitle('Top rated');
    filmsListRatingComponent.setSectionAdittionClass('films-list--extra');
    filmsListRatingComponent.addFilmsCards(FILMS_COUNT.rating);
    render(filmsListRatingComponent, this.filmsComponent.getElement());

    filmsListCommentedComponent.getElement();
    filmsListCommentedComponent.setTitle('Most commented');
    filmsListCommentedComponent.setSectionAdittionClass('films-list--extra');
    filmsListCommentedComponent.addFilmsCards(FILMS_COUNT.commented);
    render(filmsListCommentedComponent, this.filmsComponent.getElement());
  };
}
