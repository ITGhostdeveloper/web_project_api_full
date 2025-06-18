import React from "react";
import { useRef } from "react";

function EditAvatar({ onUpdateAvatar }) {
  const avatarRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();

    const newAvatarUrl = avatarRef.current.value;

    onUpdateAvatar(newAvatarUrl);
    
  }

  return (
    <form onSubmit={handleSubmit} className="popup__form">
      <input
        type="url"
        ref={avatarRef}
        placeholder="URL"
        className="popup__input popup__input_card-url"
        required
        name="link"
      />
      <span className="popup__error" id="card-url-error-profile"></span>
      <button type="submit" className="submit" id="save-avatar">
        <span className="submit__text">Guardar</span>
      </button>
    </form>
  );
}

export default EditAvatar;
