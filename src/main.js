import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortView from './view/sort-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmDetailsPresenter from './presenter/film-detais-presenter.js';
import FilmsModel from './model/films-model.js';
// import FilmDetailsView from './view/film-details-view.js';
import {render} from './render.js';

const siteBodyNode = document.querySelector('body');
const siteHeaderNode = siteBodyNode.querySelector('.header');
const siteMainNode = siteBodyNode.querySelector('.main');
const siteFooterNode = siteBodyNode.querySelector('.footer');
const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter();
const filmDetailsPresenter  = new FilmDetailsPresenter();
const filmsModel = new FilmsModel();
// const filmsItems = filmsModel.getFilms();
// const commentsItems = filmsModel.getComments();
// const filmDetailsView = new FilmDetailsView(filmsItems[0], commentsItems);

render(new ProfileView, siteHeaderNode);
render(new MainNavigationView, siteMainNode);
render(new SortView, siteMainNode);
filmsPresenter.init(siteMainNode, filmsModel);
filmDetailsPresenter.init(siteBodyNode, filmsModel);
render(new StatisticsView, footerStatisticsNode);
// render(filmDetailsView, siteBodyNode);
