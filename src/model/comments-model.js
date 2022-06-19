import Observable from '../framework/observable.js';
import FilmsModel from './films-model.js';
import {UpdateType} from '../const.js';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  get comments() {
    return this.#comments;
  }

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async (filmId) => {
    try {
      const filmComments = await this.#filmsApiService.getFilmComments(filmId);
      this.#comments = filmComments.map(CommentsModel.adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENTS);
  };

  addComment = async (updateType, update) => {
    const {film, newComment} = update;
    try {
      const response = await this.#filmsApiService.addFilmComment(newComment, film.id);
      const newComments = response.comments;
      this.#comments = newComments.map(CommentsModel.adaptToClient);
      const updatedFilm = FilmsModel.adaptToClient(response.movie);
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const {film, commentUpdate} = update;
    const index = this.#comments.findIndex((comment) => comment.id === commentUpdate.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#filmsApiService.deleteFilmComment(commentUpdate.id);

      const filmCommentIds = film.comments.slice();
      filmCommentIds.splice(index, 1);
      const filmUpdate = {...film, comments: filmCommentIds};

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, filmUpdate);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  static adaptToClient = (comment) => {
    const adaptedComment = {...comment, date: new Date(comment.date)};
    return adaptedComment;
  };
}
