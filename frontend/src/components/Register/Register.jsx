import { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ handleRegistration }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(data);
  };
  return (
    <div className="register">
      <div className="register__header">
        <img
          src="src/images/header-logo.png"
          alt="Logo"
          className="register__logo"
        />
        <Link to="/signin" className="register__header-link">
          Iniciar Sesion
        </Link>
      </div>
      <h2>Registrate</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <input
          className="register__input register__input-email"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={handleChange}
          required
        />
        <input
          className="register__input register__input-password"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={handleChange}
          required
        />
        <button className="submit-button" type="submit">
          Registrate
        </button>
      </form>
      <div className="register__login">
        <p>¿Ya eres miembro?</p>
        <Link to="/signin" className="register__login-link">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
};
export default Register;
