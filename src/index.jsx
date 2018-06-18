import React from "react";
import ReactDOM from "react-dom";

import { ContactBox } from "./ContactBox";
import { CookieBanner } from "./CookieBanner";

const App = () => (
  <div>
    <ContactBox />
    <CookieBanner />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
