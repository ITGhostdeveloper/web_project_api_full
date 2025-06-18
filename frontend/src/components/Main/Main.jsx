import { useState, useContext } from "react";
import Avatar from "../../images/Avatar.jpg";
import Pencil from "../../images/pen-button.png";
import EditImage from "../../images/Pencil.svg";
import AddButton from "../../images/sumar.png";
import Popup from "./components/popup/Popup";
import EditProfile from "./components/Popup/Form/EditProfile/EditProfile";
import NewCard from "./components/Popup/Form/NewCard/NewCard";
import EditAvatar from "./components/Popup/Form/EditAvatar/EditAvatar";
import Card from "./components/Card/Card";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import ImagePopup from "./components/Popup/ImagePopup/ImagePopup";

function Main({
  cards,
  onCardLike,
  onCardDelete,
  onUpdateAvatar,
  onAddPlaceSubmit,
  //handleClosePopup,
  handleOpenPopup,
  //popup,
}) {
  const [avatar, setAvatar] = useState("");
  const { currentUser } = useContext(CurrentUserContext);

  const editProfile = {
    title: "Editar Perfil",
    children: currentUser ? (
      <EditProfile
        name={currentUser.name}
        description={currentUser.description}
      />
    ) : null,
  };
  const newCard = {
    title: "Nuevo Lugar",
    children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />,
  };
  const editAvatar = {
    title: "Cambiar Foto de Perfil",
    children: (
      <EditAvatar
        onUpdateAvatar={(avatar) => {
          setAvatar(avatar);
          onUpdateAvatar(avatar);
        }}
      />
    ),
  };
  const cardImage = (name, link) => ({
    title: "",
    children: <ImagePopup name={name} link={link} />,
  });

  return (
    <main className="content">
      <div className="profile">
        <div className="profile__container">
          <img
            className="profile__avatar"
            src={avatar || currentUser?.avatar || Avatar}
            alt="foto de avatar"
          />
          <img
            className="profile__avatar-pencil"
            src={EditImage}
            alt=" Editar avatar"
            onClick={() => handleOpenPopup(editAvatar)}
          />
        </div>
        <div className="profile__info">
          <div className="profile__details">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              className="button"
              id="edit-button"
              onClick={() => handleOpenPopup(editProfile)}
            >
              <img className="button__image" src={Pencil} alt="button" />
            </button>
          </div>
          <p className="profile__text">{currentUser.about}</p>
        </div>
        <button
          className="add-button"
          id="add-card"
          onClick={() => handleOpenPopup(newCard)}
        >
          <img
            className="add-button__image"
            src={AddButton}
            alt="agregar tarjeta"
          />
        </button>
      </div>
      <section className="gallery">
        <div className="card-gallery">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onClick={() => handleOpenPopup(cardImage(card.name, card.link))}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </div>
      </section>
      
    </main>
  );
}

export default Main;
