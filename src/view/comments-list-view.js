import AbstractView from '../framework/view/abstract-view.js';
import {render} from '../framework/render.js';
import CommentView from './comment-view.js';
import NewCommentView from './new-comment-view.js';

const createCommentListTemplate = (commentsCount) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
    <ul class="film-details__comments-list"></ul>
  </section>`
);

export default class CommentListView extends AbstractView {
  #commentsIds = null;
  #comments = [];
  #commentsCount = null;

  constructor(commentsIds, comments) {
    super();
    this.#commentsIds = commentsIds;
    this.#comments = comments;
    this.#commentsCount = commentsIds.length;

    if (this.#commentsIds) {
      this.addCommentsCards(this.#commentsIds, this.#comments);
    }

    render(new NewCommentView(), this.element);
  }

  get template() {
    return createCommentListTemplate(this.#commentsCount);
  }

  addCommentsCards(commentsIds, comments) {
    const someComments = comments.filter((comment) => commentsIds.includes(comment.id));
    someComments.forEach((comment) => {
      render(new CommentView(comment), this.element.querySelector('.film-details__comments-list'));
    });
  }

}
