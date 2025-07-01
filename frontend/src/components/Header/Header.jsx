import HeaderLogo from "../../images/header-logo.png";

function Header({ email, handleLogout }) {
  return (
    <header className="header">
      <img className="header__logo" src={HeaderLogo} alt="Around US logo" />
      <div className="header__user-info">
        <p className="header__user-email">{email}</p>
        <button onClick={handleLogout} className="header__logout-button">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
