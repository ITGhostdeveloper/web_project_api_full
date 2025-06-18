import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext";

function EditProfile() {
  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleUpdateUser({ name, about: description });
  };

  return (
    <form className="popup__form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        id="name-profile"
        placeholder="Name"
        className="popup__input popup__input_name"
        minLength="2"
        maxLength="30"
        required
        name="name"
        value={name}
        onChange={handleNameChange}
      />
      <span className="popup__error" id="name-profile-error"></span>
      <input
        type="text"
        id="job-profile"
        placeholder="Job Title"
        className="popup__input popup__input_description"
        minLength="2"
        maxLength="30"
        required
        name="job"
        value={description}
        onChange={handleDescriptionChange}
      />
      <span className="popup__error" id="job-profile-error"></span>
      <button type="submit" className="submit" id="save-button">
        <span className="submit__text">Guardar</span>
      </button>
    </form>
  );
}

export default EditProfile;
