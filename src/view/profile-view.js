import AbstractView from '../framework/view/abstract-view.js';

const createProfileTemplate = (filmsWatchedCount) => {
  const createProfileRating = (count) => {
    let ratingName = '';

    if (count <= 10 && count !== 0) {
      ratingName = '<p class="profile__rating">Novice</p>';
    } else if (count <= 20) {
      ratingName = '<p class="profile__rating">Fan</p>';
    } else if (count > 20) {
      ratingName = '<p class="profile__rating">movie buff</p>';
    }

    return ratingName;
  };

  return `<section class="header__profile profile">
    ${createProfileRating(filmsWatchedCount)}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
   </section>`;
};

export default class ProfileView extends AbstractView {
  #filmsWatchedCount = null;

  constructor(filmsWatchedCount) {
    super();
    this.#filmsWatchedCount = filmsWatchedCount;
  }

  get template() {
    return createProfileTemplate(this.#filmsWatchedCount);
  }
}
