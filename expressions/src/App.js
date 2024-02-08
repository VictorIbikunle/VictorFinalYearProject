import Navbar from "./Navbar"
import EmotionDetection from "./pages/EmotionDetection"
import Help from "./pages/Help"
import Home from "./pages/Home"
import AppointmentScheduler from "./pages/AppointmentScheduler"
import Goal from "./pages/Goal"

import Testing from "./pages/Testing"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  let Component = Home; // Initialize to a default component

  switch (window.location.pathname) {
    case "/":
      Component = Home;
      break;
    case "/Emotion%20Detector":
      Component = EmotionDetection;
      break;
    case "/Help":
      Component = Help;
      break;
    case "/Testing":
      Component = Testing;
      break;
    case "/AppointmentScheduler":
      Component = AppointmentScheduler;
      break;
      case "/Goal":
      Component = Goal;
      break;
  }

  return (
    <>
      <Navbar />
      <Component />
    </>
  )
}

export default App;
