import FilmsListView from '../view/films-list-view.js';
import FilmsListTitleView from '../view/films-list-title-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreView from '../view/show-more-view.js';
import {render} from '../render.js';


export default class FilmsListPresenter {
  filmsListComponent = new FilmsListView();
  filmsListTitleComponent = new FilmsListTitleView();
  filmsListContainerComponent = new FilmsListContainerView();

  addTitleText(text) {
    this.filmsListTitleComponent.addText(text);
  }

  setTitleAdittionClass(adittionClass) {
    this.filmsListTitleComponent.setAdittionClass(adittionClass);
  }

  setListAdittionClass(adittionClass) {
    this.filmsListComponent.setAdittionClass(adittionClass);
  }

  init = (filmsContainer, cardCount, addShowMore = false) => {
    this.filmsContainer = filmsContainer;

    render(this.filmsListComponent, this.filmsContainer);
    render(this.filmsListTitleComponent, this.filmsListComponent.getElement());
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < cardCount; i++) {
      render(new FilmCardView(), this.filmsListContainerComponent.getElement());
    }

    if (addShowMore) {
      render(new ShowMoreView(), this.filmsListComponent.getElement());
    }
  };
}
