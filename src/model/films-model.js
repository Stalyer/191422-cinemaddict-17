import {generateFilm} from '../mock/film.js';
import {generateComment} from '../mock/comment.js';

export default class FilmsModel {
  #films = Array.from({length: 5}, generateFilm);
  #comments = Array.from({length: 5}, generateComment);

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
