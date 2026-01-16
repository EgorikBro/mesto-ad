import axios from "axios";

const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "b9b14df2-1f4b-404f-b40b-17d3c1cfdf88",
    "Content-Type": "application/json",
  },
};

// Создаем экземпляр приложения axios
const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: config.headers,
});

const getResponseData = (res) => {
  return res.data;
};

export const getUserInfo = () => {
  return apiClient.get("/users/me").then(getResponseData);
};

export const getCardList = () => {
  return apiClient.get("/cards").then(getResponseData);
};

export const setUserInfo = ({ name, about }) => {
  return apiClient
    .patch("/users/me", {
      name,
      about,
    })
    .then(getResponseData);
};

export const setUserAvatar = (avatarLink) => {
  return apiClient
    .patch("/users/me/avatar", {
      avatar: avatarLink,
    })
    .then(getResponseData);
};

export const createCard = ({ name, link }) => {
  return apiClient
    .post("/cards", {
      name,
      link,
    })
    .then(getResponseData);
};

export const deleteCardApi = (cardId) => {
  return apiClient.delete(`/cards/${cardId}`).then(getResponseData);
};

export const likeCardApi = (cardId) => {
  return apiClient.put(`/cards/likes/${cardId}`).then(getResponseData);
};

export const dislikeCardApi = (cardId) => {
  return apiClient.delete(`/cards/likes/${cardId}`).then(getResponseData);
};
