import "./Home.css";
import { useContext } from "react";
import { userSession } from "../../main/App";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  axios.defaults.withCredentials = true;

  const User: any = useContext(userSession);

  const handleLogout = () => {
    axios
      .get("http://localhost:3001/Logout")
      .then((res) => {
        location.reload();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="FormContainer">
        <div className="FormBlock HomeBlock">
          <h2>
            {User.userInfo.session ? `Hi! ${User.userInfo.name}` : "Home"}
          </h2>
          {User.userInfo.session ? `Logged In` : "Not Logged"}
          {User.userInfo.session ? (
            <button className="DfButton" onClick={handleLogout}>
              {" "}
              Log out{" "}
            </button>
          ) : (
            <Link to="/Login">
              <button className="DfButton"> Log in </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
