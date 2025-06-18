function InfoTooltip(props) {
  const { title, children, image } = props;

  return (
    <dialog className="confirmation-box">
      <div
        className={`confirmation-box__container ${
          !title ? "confirmation__image-container" : ""
        }`}
      >
        <div>
          <img src={image} alt="Check" className="confirmation__image" />
        </div>
        {title && <h3 className="confirmation-box__text">{title}</h3>}
        {children}
      </div>
    </dialog>
  );
}

export default InfoTooltip;
