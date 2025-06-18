import HeaderLogo from "../../images/header-logo.png";

function Header({email}) {
  return (
    <>
      <header className="header">
        <img className="header__logo" src={HeaderLogo} alt="Around US logo" />
        <div className="header__user-email">{email}</div>
      </header>
      ;
    </>
  );
}

export default Header;
