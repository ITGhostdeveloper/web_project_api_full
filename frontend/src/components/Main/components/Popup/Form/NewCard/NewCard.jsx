import { useEffect, useState } from "react";

function NewCard({ onAddPlaceSubmit }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    setName("");
    setLink("");
  }, []);

  const handleTitleChange = (event) => {
    setName(event.target.value);
  };
  const handleUrlChange = (event) => {
    setLink(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    onAddPlaceSubmit({ name, link });
  };

  return (
    <form
      method="post"
      className="popup__form"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        type="text"
        id="card-title"
        placeholder="Title"
        className="popup__input popup__input_card-title"
        minLength="2"
        maxLength="30"
        required
        name="name"
        value={name}
        onChange={handleTitleChange}
      />
      <input
        type="url"
        id="card-url"
        placeholder="URL"
        className="popup__input popup__input_card-url"
        required
        name="link"
        value={link}
        onChange={handleUrlChange}
      />
      <button type="submit" className="submit" id="save-card">
        <span className="submit__text">Crear</span>
      </button>
    </form>
  );
}

export default NewCard;
