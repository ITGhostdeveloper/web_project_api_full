import ImagePopup from "../Popup/ImagePopup/ImagePopup";

function Card(props) {
  const { card, onClick, onCardLike, onCardDelete } = props;
  const { name, link, isLiked } = card;

  const popupImage = {
    title: "",
    children: <ImagePopup name={name} link={link} />,
  };
  const cardLikeButtonClassName = `button-liked ${
    isLiked ? "liked-button" : ""
  }`;

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="card" id="card">
      <img
        className="card__image"
        src={link}
        alt=""
        onClick={() => onClick(popupImage)}
      />
      <div className="card__elements">
        <button
          className="remove-card"
          onClick={() => {
            handleDeleteClick();
          }}
        ></button>
        <p className="card__text">{name}</p>
        <button
          className={cardLikeButtonClassName}
          onClick={() => {
            handleLikeClick();
          }}
        ></button>
      </div>
    </div>
  );
}

export default Card;
