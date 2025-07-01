import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Signin from "./Login/Login";
import Signup from "./Register/Register";
import CurrentUserContext from "../contexts/CurrentUserContext";
import * as auth from "../utils/auth";
import { api } from "../utils/api";
import InfoTooltip from "./InfoTooltip/InfoTooltip";
import Popup from "./Main/components/popup/Popup";
import fail from "../images/fail.png";
import success from "../images/check.png";

function App() {
  const [userData, setUserData] = useState({ email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const navigate = useNavigate();

  const handleRegistration = ({ email, password }) => {
    auth
      .signUp(email, password)
      .then(() => {
        handleOpenPopup({
          children: (
            <InfoTooltip
              title="¡Correcto! Ya estás registrado."
              image={success}
              onClose={() => {
                handleClosePopup();
              }}
            />
          ),
        });
        navigate("/signin");
      })
      .catch((err) => {
        let message = "¡Error! Este correo ya está registrado.";
        let error = fail;

        if (err.code === "auth/email-already-in-use") {
          message = "¡Error! Este correo ya esta en uso";
        }
        handleOpenPopup({
          children: (
            <InfoTooltip
              title={message}
              image={error}
              onClose={() => {
                handleClosePopup();
              }}
            />
          ),
        });
      });
  };
  // manejo de la autenticación
  const handleLogin = ({ email, password }) => {
    if (!email || !password) return;
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          // Guardar token en localStorage
          localStorage.setItem("jwt", data.token);
          // Actualizar el estado del token
          setToken(data.token);
          // Guardar datos del usuario
          setIsLoggedIn(true);
          // Cargar datos del usuario
          api
            .getUserInfo(data.token)
            .then((userData) => {
              setCurrentUser(userData);
              setUserData({ email });
              navigate("/");
            })
            .catch((err) =>
              console.error("Error al obtener info del usuario:", err)
            );
        } else {
          console.error("No se recibió token.");
        }
      })
      .catch(() => {
        let message = "¡Error! Credenciales incorrectas.";
        let error = fail;
        handleOpenPopup({
          children: (
            <InfoTooltip
              title={message}
              image={error}
              onClose={() => {
                handleClosePopup();
              }}
            />
          ),
        });
      });
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      navigate("/signin");
      return;
    }

    setToken(jwt);
    setIsLoggedIn(true);

    api
      .getUserInfo(jwt)
      .then((userData) => {
        setCurrentUser(userData);
        setUserData({ email: userData.email });
        navigate("/");
      })
      .catch((err) => {
        console.error("Token inválido:", err);
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        navigate("/signin");
      });
  }, []);

  const [popup, setPopup] = useState(null);
  const handleClosePopup = () => {
    setPopup(null);
  };
  const handleOpenPopup = (popup) => {
    setPopup(popup);
  };
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    navigate("/signin");
  };

  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .setUserInfo(data, token)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await api.getUserInfo(token);
        if (data && data.avatar) {
          setCurrentUser(data);
          setAvatar(data.avatar);
        } else {
          console.warn("La respuesta del usuario es inválida:", data);
        }
      } catch (err) {
        console.error("Error al obtener la información del usuario:", err);
      }
    })();
  }, [token]);

  const handleUpdateAvatar = (data) => {
    (async () => {
      await api
        .updateProfilePicture(data, token)
        .then((newData) => {
          setCurrentUser((prevUser) => ({
            ...prevUser,
            avatar: newData.avatar,
          }));
          handleClosePopup();
        })
        .catch((error) =>
          console.error("Error al actualizar el avatar:", error)
        );
    })();
  };

  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!token) return;
    api
      .getInitialCards(token)
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, [token]);

  async function handleCardLike(card) {
    //const isLiked = card.likes.length > 0 && card.likes.some((like) => like._id === currentUser._id);
    const isLiked = card.likes.length > 0;

    await api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        console.log("Nueva tarjeta después de like:", newCard);
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((error) => console.error(error));
  }

  async function handleCardDelete(card) {
    await api
      .deleteCard(card._id, token)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((error) => console.error(error));
  }

  const handleAddPlaceSubmit = async (data) => {
    try {
      if (!token) {
        console.error(" Token no disponible. No se puede agregar tarjeta.");
        return;
      }
      if (!data.name || !data.link) {
        console.error(" Faltan datos de la tarjeta (name o link)");
        return;
      }
      const newCard = await api.addCard(
        { name: data.name, link: data.link },
        token
      );
      setCards((prevCards) => [newCard, ...prevCards]);
      handleClosePopup();
    } catch (error) {
      console.error("Error al agregar la tarjeta:", error);
    }
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <div className="page">
                <Header
                  avatar={avatar}
                  email={userData.email}
                  handleLogout={handleLogout}
                />
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onUpdateAvatar={handleUpdateAvatar}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  handleOpenPopup={handleOpenPopup}
                  handleClosePopup={handleClosePopup}
                  popup={popup}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <div className="signinContainer">
              <Signin handleLogin={handleLogin} />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="signupContainer">
              <Signup handleRegistration={handleRegistration} />
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </CurrentUserContext.Provider>
  );
}

export default App;
