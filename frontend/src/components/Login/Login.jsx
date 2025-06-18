import { Link } from "react-router-dom";
import { useState } from "react";

const Login = ({ handleLogin }) => {
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
    console.log("first")
    handleLogin(data);
  };
  return (
    <div className="login">
      <div className="login__header">
        <img
          src="src/images/header-logo.png"
          alt="Logo"
          className="login__logo"
        />
        <Link to="/signup" className="login__header-link">
          Regístrate
        </Link>
      </div>
      <h2>Inicia sesión</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <input
          className="login__input login__input-email"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={handleChange}
          required
        />
        <input
          className="login__input login__input-password"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={handleChange}
          required
        />
        <button className="submit-button" type="submit">
          Inicia sesión
        </button>
      </form>
      <div className="login__register">
        <p>¿Aún no eres miembro?</p>
        <Link to="/signup" className="login__register-link">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
};

export default Login;
