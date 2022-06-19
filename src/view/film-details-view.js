import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import {converterMinutesToDuration} from '../utils/film.js';
import {EMOTIONS} from '../const.js';
import he from 'he';

const createFilmDetailsTemplate = (filmItem) => {
  const {film, commentsCount, newComment, isDisabled} = filmItem;
  const {filmInfo, userDetails} = film;
  const watchlistClassName = userDetails.watchlist ? ' film-details__control-button--active' : '';
  const alreadyWatchedClassName = userDetails.alreadyWatched ? ' film-details__control-button--active' : '';
  const favoriteClassName = userDetails.favorite ? ' film-details__control-button--active' : '';

  const createGenresTemplate = (genres) => {
    let genresTempalte = '';
    genres.forEach((genre) => {
      genresTempalte += `<span class="film-details__genre">${genre}</span>`;
    });
    return genresTempalte;
  };

  const createEmojiListTemplate = (currentEmotion) => EMOTIONS.map((emotion) => `<input
    class="film-details__emoji-item visually-hidden"
    name="comment-emoji"
    type="radio"
    id="emoji-${emotion}"
    value="${emotion}"
    ${currentEmotion === emotion ? 'checked' : ''}
    ${isDisabled ? 'disabled' : ''}
  >
  <label
    class="film-details__emoji-label"
    for="emoji-${emotion}"
    >
    <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
  </label>`).join('');

  const createNewCommentTemplate = (newCommentItem) => {
    const {emotion, comment} = newCommentItem;
    const emojiImageTemplate = emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">` : '';
    const userComment = comment ? comment : '';
    const emojiListTemplate = createEmojiListTemplate(emotion);

    return `<div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${emojiImageTemplate}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${isDisabled ? ' disabled' : ''}>${he.encode(userComment)}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiListTemplate}
      </div>
    </div>`;
  };

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

                    <p class="film-details__age">${filmInfo.ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${filmInfo.title}</h3>
                        <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${filmInfo.director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${dayjs(filmInfo.release.date).format('DD MMM YYYY')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${converterMinutesToDuration(filmInfo.runtime)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${filmInfo.genre.length > 1 ? 'Genres' : 'Genre'}</td>
                        <td class="film-details__cell">
                          ${createGenresTemplate(filmInfo.genre)}
                        </td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${filmInfo.description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist${watchlistClassName}" id="watchlist" name="watchlist"${isDisabled ? ' disabled' : ''}>Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched${alreadyWatchedClassName}" id="watched" name="watched"${isDisabled ? ' disabled' : ''}>Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite${favoriteClassName}" id="favorite" name="favorite"${isDisabled ? ' disabled' : ''}>Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>
                  ${commentsCount > 0 ? '<ul class="film-details__comments-list"></ul>' : ''}
                  ${createNewCommentTemplate(newComment)}
                </section>
              </div>
            </form>
          </section>`;
};

export default class FilmDetailsView extends AbstractStatefulView {
  constructor(film, commentsCount) {
    super();
    this._state = FilmDetailsView.convertFilmToState(film, commentsCount);
    this.#setOnInner();
  }

  get template() {
    return createFilmDetailsTemplate(this._state);
  }

  get commentsContainerNode() {
    return this.element.querySelector('.film-details__comments-list');
  }

  get formNode() {
    return this.element.querySelector('.film-details__inner');
  }

  get controlsNode() {
    return this.element.querySelector('.film-details__controls');
  }

  get scrollPosition() {
    return this.element.scrollTop;
  }

  set scrollPosition(value) {
    this.element.scrollTo(0, value);
  }

  setOnCloseBtnClick = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onCloseBtnClick);
  };

  setOnWatchlistClick = (callback) => {
    this._callback.watchlistClick  = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onWatchlistClick);
  };

  setOnWatchedClick = (callback) => {
    this._callback.watchedClick  = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
  };

  setOnFavoriteClick = (callback) => {
    this._callback.favoriteClick  = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavoriteClick);
  };

  setOnNewCommentSend = (callback) => {
    this._callback.newCommentSend = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#onCommentUserSend);
  };

  setOnRenderComment = (callback) => {
    this._callback.renderComments = callback;
  };

  #onCloseBtnClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #onWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #onChangeEmoji = (evt) => {
    const currerScrollPosition = this.scrollPosition;
    this.updateElement({...this._state, newComment: {...this._state.newComment, emotion: evt.target.value}});
    this._callback.renderComments();
    this.scrollPosition = currerScrollPosition;
  };

  #onCommentUserInput = (evt) => {
    this._setState({newComment: {...this._state.newComment, comment: evt.target.value}});
  };

  #onCommentUserSend = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter') {
      const newComment = this._state.newComment;
      this._callback.newCommentSend({emotion: newComment.emotion, comment: newComment.comment});
    }
  };

  #setOnInner = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#onChangeEmoji);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#onCommentUserInput);
  };

  _restoreHandlers = () => {
    this.#setOnInner();
    this.setOnCloseBtnClick(this._callback.click);
    this.setOnWatchlistClick(this._callback.watchlistClick);
    this.setOnWatchedClick(this._callback.watchedClick);
    this.setOnFavoriteClick(this._callback.favoriteClick);
    this.setOnNewCommentSend(this._callback.newCommentSend);
  };

  static convertFilmToState = (film, commentsCount) => {
    const state = {film: {...film}, commentsCount: commentsCount, newComment: {emotion: null, comment: null}, isDisabled: false};

    return state;
  };
}
