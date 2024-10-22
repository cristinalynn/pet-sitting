import React from "react";
import App from "./components/App";
import "./index.css";
import ReactDOM from 'react-dom/client';
import store from './store'
import { Provider } from 'react-redux'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <App />
  </Provider>
)
