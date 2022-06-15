import Observable from '../framework/observable.js';
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
      this.#comments = filmComments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENTS);
  };

  addComment = async (updateType, update) => {
    try {
      const response = await this.#filmsApiService.addFilmComment({comment: update.comment, emotion: update.emotion}, update.filmId);
      const newComments = response.comments;
      this.#comments = newComments.map(this.#adaptToClient);
      // this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#filmsApiService.deleteFilmComment(update.id);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment, date: new Date(comment.date)};
    return adaptedComment;
  };
}
