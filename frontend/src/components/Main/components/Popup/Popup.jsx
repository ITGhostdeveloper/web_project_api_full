function Popup(props) {
  const { title, children, onClose } = props;
  console.log(children)
  return (
    <dialog className="popup">
      <div
        className={`popup__container ${!title ? "popup__image-container" : ""}`}
      >
        <button className="close" onClick={onClose}>
          x
        </button>
        {title && <h3 className="popup__title">{title}</h3>}
        {children}

      </div>
    </dialog>
  );
}

export default Popup;
