import "../css/LandingHome.css";
import "../css/LandingParking.css";
import "../css/LandingProcedure.css";
import "../css/Header1.css";
import "../css/Footer.css";
import "../css/ScrollUp.css";

import { Header1 } from "../components/Header1";
import { Footer } from "../components/Footer";
import { ScrollUp } from "../components/ScrollUp";

import { LandingHome } from "../components/LandingHome";
import { LandingProcedure } from "../components/LandingProcedure";
import LandingParking from "../components/LandingParking";

export function MainPage() {
  return (
    <>
      <Header1 />
      <LandingHome />
      <LandingProcedure />
      <LandingParking />
    </>
  );
}
