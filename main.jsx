import React, { useState, useEffect } from "react";
import "./App.css"; // Create an App.css file to hold your styles
import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
import "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
import "https://fonts.googleapis.com/css?family=Acme";

const App = () => {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showHomeButton, setShowHomeButton] = useState(false);

  useEffect(() => {
    const personas = document.querySelectorAll(".user-persona");
    setTimeout(() => {
      personas.forEach((persona, index) => {
        setTimeout(() => {
          persona.classList.add("show");
        }, index * 200);
      });
    }, 500);
  }, []);

  const handlePersonaClick = (persona) => {
    setSelectedPersona(persona);
    setShowSpinner(true);
    document.querySelector(".heading").style.opacity = 0;
    document.querySelector(".bubble-container").style.transform =
      "translateY(-80%)";
    setTimeout(() => {
      setShowSpinner(false);
      setShowOverlay(true);
      document.querySelector(".heading").style.opacity = 0;
      const personas = document.querySelectorAll(".user-persona");
      personas.forEach((p) => {
        p.classList.remove("show");
        p.classList.add("unselected");
      });
      document.querySelector(`[data-persona="${persona}"]`).classList.add(
        "selected"
      );
      document.querySelector(`[data-persona="${persona}"]`).classList.remove(
        "unselected"
      );
      setTimeout(() => {
        document.querySelector(".personas").classList.add("shrink");
        setShowHomeButton(true);
      }, 500);
    }, 3000);
  };

  const handleHomeButtonClick = () => {
    document.querySelector(".bubble-container").style.transform =
      "translateY(0)";
    document.querySelector(".heading").style.opacity = 1;
    setShowSpinner(false);
    setShowOverlay(false);
    setShowHomeButton(false);
    const personas = document.querySelectorAll(".user-persona");
    personas.forEach((persona) => {
      persona.classList.remove("selected", "unselected");
      persona.classList.add("show");
    });
    setTimeout(() => {
      document.querySelector(".personas").classList.remove("shrink");
    }, 500);
  };

  return (
    <div className="bubble-container">
      <div className="heading">
        <h2>Welcome to Restaura I³</h2>
      </div>
      <div className="personas">
        <div
          className="user-persona c-level"
          data-persona="C-level Executive"
          onClick={() => handlePersonaClick("C-level Executive")}
        >
          <img src="./business.png" alt="C-level Executive" />
          <div className="title">C-level Executive</div>
          <div className="persona-title">Click to explore</div>
        </div>
        <div
          className="user-persona resident"
          data-persona="Resident"
          onClick={() => handlePersonaClick("Resident")}
        >
          <img src="./resident.png" alt="Resident" />
          <div className="title">Resident</div>
          <div className="persona-title">Click to explore</div>
        </div>
        <div
          className="user-persona restaura"
          data-persona="Restaura Enthusiast"
          onClick={() => handlePersonaClick("Restaura Enthusiast")}
        >
          <img src="./restaura.png" alt="Restaura Enthusiast" />
          <div className="title">Restaura Enthusiast</div>
          <div className="persona-title">Click to explore</div>
        </div>
      </div>
      {showSpinner && (
        <div className="spinner-cube">
          <div className="spinner-cube-inner">
            <div className="cube-face">R</div>
            <div className="cube-face">E</div>
            <div className="cube-face">S</div>
            <div className="cube-face">T</div>
            <div className="cube-face">A</div>
            <div className="cube-face">U</div>
          </div>
        </div>
      )}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2 id="selected-persona-title">{selectedPersona}</h2>
            <p id="selected-persona-content">
              Welcome to the {selectedPersona} section. Here you will find all
              the resources and information tailored for you.
            </p>
            <button className="home-button" onClick={handleHomeButtonClick}>
              Go Home
            </button>
          </div>
        </div>
      )}
      <footer>&copy; 2024 Restaura I³</footer>
    </div>
  );
};

export default App;
