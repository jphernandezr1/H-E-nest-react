import React from "react";
import "./App.css";
import ForumPage from "./pages/ForumPage";
import CommentPage from "./pages/CommentPage";
import LandingPage from "./pages/LandingPage";
import RecetasPage from "./pages/RecetasPage";
import RutinasPage from "./pages/RutinasPage";
import RecetaDetail from "./pages/RecetaDetail";
import RutinaDetail from "./pages/RutinaDetail";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import MetricsPage from "./pages/MetricsPage";
import LoginPage from "./pages/LoginPage";
import {IntlProvider} from 'react-intl';
import { useState } from "react";
import en from './locales/en.json'
import es from './locales/es.json'
export default function App() {
  const [messages, setMessages] = useState(navigator.language === 'en'? en : es)
  return (
     <IntlProvider locale={navigator.language} messages={messages}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route exact path="foros" element={<ForumPage/>} />
        <Route exact path="usuarios" element={<UserPage/>} />
        <Route exact path="usuarios/metricas/:metricsId" element={<MetricsPage/>} />
        <Route exact path="Recetas" element={<RecetasPage/>} />
        <Route exact path="rutinas" element={<RutinasPage/>} />
        <Route exact path="login" element={<LoginPage/>} />
        <Route path="recetas/:recetaId" element={<RecetaDetail />} />
        <Route path="rutinas/:rutinaId" element={<RutinaDetail />} />
        <Route path="foros/:foroId"element={<CommentPage/>} />
        <Route path="*" element="Not Found" />
      </Routes>
      <Footer />
    </BrowserRouter>
    </IntlProvider>
  );
}
