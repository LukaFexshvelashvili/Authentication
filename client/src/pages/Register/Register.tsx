import { useContext, useEffect, useState } from "react";
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
  const [values, setValues] = useState({
    mail: "",
    name: "",
    password: "",
  });
  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post("http://localhost:3001/Register", values).then((res: any) => {
      if (res.data.Status === 1) {
        navigate("/Login");
      }
    });
  };
  return (
    <div className="FormContainer">
      <div className="FormBlock">
        <form onSubmit={(e) => handleForm(e)}>
          <h2>Register</h2>
          <label>Mail:</label>
          <input
            onChange={(e) => setValues({ ...values, mail: e.target.value })}
            type="text"
          />

          <label>Username:</label>

          <input
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            type="text"
          />
          <label>Password:</label>

          <input
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            type="password"
          />
          <button>Sign up</button>
          <p className="Quest">
            Already have account? <Link to="/Login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
