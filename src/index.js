import React from "react";
import ReactDOM from "react-dom";

const App = () => (
  <div>
    <ContactBox />
    <CookieBanner />
  </div>
);

ReactDOM.render(<App />, document.getElementById("app"));
