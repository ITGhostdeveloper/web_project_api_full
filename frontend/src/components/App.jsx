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
    console.log("second");
    console.log(email);
    console.log(password);
    if (!email || !password) return;
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          // Guardar token en localStorage
          localStorage.setItem("jwt", data.token);
          // Guardar datos del usuario
          setIsLoggedIn(true);
          // Cargar datos del usuario
          api
            .getUserInfo()
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

  const handleUpdateUser = (data) => {
    (async () => {
      await api
        .setUserInfo(data)
        .then((newData) => {
          setCurrentUser(newData);
          handleClosePopup();
        })
        .catch((error) => console.error(error));
    })();
  };

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    (async () => {
      await api.getUserInfo().then((data) => {
        setCurrentUser(data);
        setAvatar(data.avatar);
      });
    })();
  }, []);

  const handleUpdateAvatar = (data) => {
    (async () => {
      await api
        .updateProfilePicture(data)
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
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  async function handleCardLike(card) {
    const isLiked = card.isLiked;

    await api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
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
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })
      .catch((error) => console.error(error));
  }

  const handleAddPlaceSubmit = async (data) => {
    try {
      const newCard = await api.addCard({ name: data.name, link: data.link });
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
                <Header avatar={avatar} email={userData.email} />
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
