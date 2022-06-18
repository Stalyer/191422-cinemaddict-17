import {render} from './framework/render.js';
import StatisticsView from './view/statistics-view.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION = 'Basic h68fa2b9sd5eqqeltb';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteBodyNode = document.querySelector('body');
const siteHeaderNode = siteBodyNode.querySelector('.header');
const siteMainNode = siteBodyNode.querySelector('.main');
const siteFooterNode = siteBodyNode.querySelector('.footer');
const footerStatisticsNode = siteFooterNode.querySelector('.footer__statistics');

const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(siteHeaderNode, siteMainNode, siteBodyNode, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainNode, filterModel, filmsModel);

filterPresenter.init();
filmsPresenter.init();
filmsModel.init().finally(() => {
  render(new StatisticsView(filmsModel.films.length), footerStatisticsNode);
});
