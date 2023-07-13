import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "../pages/Home/Home";
import { createContext, useEffect, useState } from "react";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import axios from "axios";

export const userSession = createContext({});

function App() {
  axios.defaults.withCredentials = true;

  const [userInfo, setUserInfo] = useState({
    session: false,
    id: null,
    name: null,
    mail: null,
  });
  useEffect(() => {
    axios.get("http://localhost:3001").then((res: any) => {
      if (res.data.userData && userInfo.session === false) {
        setUserInfo({
          session: true,
          id: res.data.userData.id,
          name: res.data.userData.name,
          mail: res.data.userData.mail,
        });
      }
    });
  }, []);

  return (
    <>
      <userSession.Provider value={{ userInfo, setUserInfo }}>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="Register" element={<Register />} />
            <Route path="Login" element={<Login />} />
          </Route>
        </Routes>
      </userSession.Provider>
    </>
  );
}

export default App;
