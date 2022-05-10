import ProfileView from './view/profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/films-model.js';
import {render} from './render.js';

const siteBodyNode = document.querySelector('body');
const siteHeaderNode = siteBodyNode.querySelector('.header');
const siteMainNode = siteBodyNode.querySelector('.main');
const siteFooterNode = siteBodyNode.querySelector('.footer');
const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter();
const filmsModel = new FilmsModel();

render(new ProfileView, siteHeaderNode);
render(new MainNavigationView, siteMainNode);
filmsPresenter.init(siteMainNode, siteBodyNode, filmsModel);
render(new StatisticsView, footerStatisticsNode);
