import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        navigate("/login");
      }
    } catch (error) {
      console.log("Register error:", error);
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

        <h1>Create Account</h1>

        <p className="login-subtitle">
          Start writing your beautiful memories ✨
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label>Password</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

          {/* Confirm Password */}
          <label>Confirm Password</label>

          <div className="password-box">

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>

          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="login-button"
          >
            Create Account
          </button>

        </form>

        {/* Login */}
        <p className="register-text">
          Already have an account?

          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;