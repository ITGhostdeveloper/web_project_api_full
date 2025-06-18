function ImagePopup(props) {
  const { name, link } = props;
  return (
    <>
      <img className="image-details" src={link} alt="" />
      <h2 className="popup-name">{name}</h2>
    </>
  );
}

export default ImagePopup;
