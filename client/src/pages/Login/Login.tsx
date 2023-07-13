import { useContext, useEffect, useState } from "react";
import "../Register/Register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { userSession } from "../../main/App";

export default function Register() {
  const navigate = useNavigate();
  const userData: any = useContext(userSession);
  useEffect(() => {
    if (userData.userInfo.session === true) {
      navigate("/");
    }
  }, [userData]);

  axios.defaults.withCredentials = true;
  const [values, setValues] = useState({
    mail: "",
    password: "",
  });
  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post("http://localhost:3001/Login", values).then((res: any) => {
      if (res.data.Status === 1) {
        userData.setUserInfo({
          session: true,
          id: res.data.id,
          name: res.data.name,
          mail: res.data.mail,
        });
        navigate("/");
      }
    });
  };
  return (
    <div className="FormContainer">
      <div className="FormBlock">
        <form onSubmit={(e) => handleForm(e)}>
          <h2>Log in</h2>
          <label>Mail:</label>
          <input
            onChange={(e) => setValues({ ...values, mail: e.target.value })}
            type="text"
          />

          <label>Password:</label>

          <input
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            type="password"
          />
          <button>Log in</button>
          <p className="Quest">
            Dont have account? <Link to="/Register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
