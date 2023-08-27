import { useState } from "react";
import "./App.css";
import initialization from "./Firebase/firebaseInitialize";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

// calling auth
initialization();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

function App() {
  const [user, setUser] = useState({});
  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const auth = getAuth();

  // goggle authentication sign in
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => setError(error));
  };

  // github authentication sign in
  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => setError(error));
  };

  // signout function
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
      })
      .catch((error) => setError(error));
  };

  // mail authntication
  // name field function
  const inputName = (e) => {
    setName(e.target.value);
  };

  // email field function
  const inputEmail = (e) => {
    setEmail(e.target.value);
  };

  // password function
  const inputPassword = (e) => {
    setPassword(e.target.value);
  };

  // password authentication
  // from submit
  const handleRegistration = (e) => {
    e.preventDefault();
    // error handling before submission
    if (password.length < 6) {
      setError("Password should be contain with 6 characters");
      return;
    }

    // calling function process login when user have an account and when he/she doesn't then calling registration function
    // both function will receive email and password as parameter
    isLogin ? processLogin(email, password) : createNewUser(email, password);
  };

  // user login function
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // new user registration function
  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        // if success then error will be empty
        setError("");
        // email verification calling.
        verifyEmail();
      })
      // showing error from firebase
      .catch((error) => setError(error.message));
  };

  // login toggle
  const loginToggle = (e) => {
    setIsLogin(e.target.checked);
  };

  // email verification function
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then((result) => {
      const user = result.user;
      console.log(user);
    });
  };

  return (
    <>
      {/* set log in form when user already have an account */}
      <h4>{isLogin ? "Log In" : "Register User"}</h4>
      <form onSubmit={handleRegistration}>
        {/* if user have an account then he/she doesn't have to put user name */}
        {!isLogin ? (
          <div className="mb-3">
            <label htmlFor="InputName" className="form-label">
              Name
            </label>
            <input
              onBlur={inputName}
              type="name"
              className="form-control"
              required
            />
            <div className="form-text">
              We'll never share your name with anyone else.
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="mb-3">
          <label htmlFor="InputEmail1" className="form-label">
            Email address
          </label>
          <input
            onBlur={inputEmail}
            type="email"
            className="form-control"
            required
          />
          <div className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="InputPassword" className="form-label">
            Password
          </label>
          <input
            onBlur={inputPassword}
            type="password"
            className="form-control"
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            onChange={loginToggle}
            type="checkbox"
            className="form-check-input"
            id="Check1"
          />
          <label className="form-check-label" htmlFor="Check1">
            Already registered?
          </label>
        </div>
        {<div>{error}</div>}
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Log In" : "Register"}
        </button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <div>
        -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      </div>
      <div className="btn-group">
        {user.email ? (
          <button
            onClick={handleSignOut}
            type="button"
            className="btn btn-primary m-2 rounded"
          >
            Sign Out
          </button>
        ) : (
          <div>
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="btn btn-primary m-2 rounded"
            >
              Google Sign In
            </button>
            <button
              onClick={handleGithubSignIn}
              type="button"
              className="btn btn-primary m-2 rounded"
            >
              Github Sign In
            </button>
          </div>
        )}
      </div>
      {user.email && (
        <div>
          <h1>{user.displayName}</h1>
          <h4>{user.email}</h4>
          <img src={user.photoURL} />
        </div>
      )}
    </>
  );
}

export default App;
