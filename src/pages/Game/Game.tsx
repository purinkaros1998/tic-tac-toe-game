import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./game.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Board from "../../components/Board";
import axios from "axios";

export type userDetailsType = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

const Game = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<userDetailsType>();

  const getUserDetails = async (accessToken: string) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
      );

      setUserDetails(data);
    } catch (error) {
      Cookies.remove("access_token");
      navigate("/");
    }
  };

  useEffect(() => {
    const accessToken: string = Cookies.get("access_token")!;
    if (!accessToken) {
      navigate("/");
    }
    getUserDetails(accessToken);
  }, [navigate]);

  const onSignOut = () => {
    navigate("/");
    Cookies.remove("access_token");
  };

  return (
    <>
      <div className="nav-bar">
        {userDetails && (
          <>
            <div className="user-profile">
              <div className="card">
                <img
                  src={userDetails.picture}
                  alt={`${userDetails.given_name}'s profile`}
                  className="profile-pic"
                />
                <p>Welcome</p>
                <p className="name">{userDetails.name}</p>
              </div>
            </div>
            <div>
              <FontAwesomeIcon
                className="signout"
                icon={faRightFromBracket}
                onClick={() => onSignOut()}
              />
            </div>
          </>
        )}
      </div>

      {userDetails ? (
        <div className="game">
          <div className="game-board">
            <Board userDetails={userDetails} />
          </div>
        </div>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
};

export default Game;
