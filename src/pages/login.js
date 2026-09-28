import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login successful");

        navigate("/home");

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: "url('/login.png')",
      }}
    >

      <div className="login-card">

        <div className="login-icon">
          📖
        </div>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Continue writing your beautiful memories ✨
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <div className="password-box">

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?

          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;