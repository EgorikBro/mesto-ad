export const likeCard = (likeButton, cardId, likesCountElement, onLike) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  onLike(cardId, isLiked, likeButton, likesCountElement);
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  userId,
  { onPreviewPicture, onLikeIcon, onDeleteCard }
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likesCountElement = cardElement.querySelector(".card__like-count"); // Нужно добавить в шаблон, если нет

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  
  // Отображаем количество лайков
  if (likesCountElement) {
    likesCountElement.textContent = data.likes.length;
  }

  // Проверяем, лайкнул ли пользователь эту карточку
  const isLiked = data.likes.some((like) => like._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => onLikeIcon(likeButton, data._id, likesCountElement));
  }

  if (userId === data.owner._id && onDeleteCard) {
    deleteButton.addEventListener("click", () => onDeleteCard(data._id, cardElement));
  } else {
    deleteButton.remove();
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () => onPreviewPicture({name: data.name, link: data.link}));
  }

  return cardElement;
};
