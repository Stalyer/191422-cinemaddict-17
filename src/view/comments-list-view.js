import {createElement} from '../render.js';
import CommentView from './comment-view.js';
import NewCommentView from './new-comment-view.js';
import {render} from '../render.js';

const createCommentListTemplate = (commentsCount) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentListView {
  #element = null;
  #commentsIds = null;
  #comments = [];
  #commentsCount = null;

  constructor(commentsIds, comments) {
    this.#commentsIds = commentsIds;
    this.#comments = comments;
    this.#commentsCount = commentsIds.length;
  }

  get template() {
    return createCommentListTemplate(this.#commentsCount);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);

      if (this.#commentsIds) {
        this.addCommentsCards(this.#commentsIds, this.#comments);
      }

      render(new NewCommentView(), this.#element);
    }

    return this.#element;
  }

  addCommentsCards(commentsIds, comments) {
    const someComments = comments.filter((comment) => commentsIds.includes(comment.id));
    someComments.forEach((comment) => {
      render(new CommentView(comment), this.#element.querySelector('.film-details__comments-list'));
    });
  }

  removeElement() {
    this.#element = null;
  }
}
