import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className="profile-page"
      style={{
        backgroundImage: "url('/home-bg.png')",
      }}
    >
      <div className="profile-card">

        {/* Back Button */}
        <button
          className="profile-back-btn"
          onClick={() => navigate("/home")}
        >
          ← Back to Home
        </button>


        {/* Profile Bunny */}
        <div className="profile-bunny">
          <img
            src="/bunny_18_heart.png"
            alt="Cute bunny"
          />
        </div>


        {/* Profile Title */}
        <h1>
          My Profile 👤
        </h1>

        <p className="profile-subtitle">
          Your personal diary space 💙
        </p>


        {/* User Avatar */}
        <div className="profile-avatar">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>


        {/* User Name */}
        <h2>
          {user.name}
        </h2>


        <p className="profile-email">
          {user.email}
        </p>


        {/* Profile Information */}
        <div className="profile-info">

          <div className="profile-info-row">
            <span>👤 Name</span>
            <strong>{user.name}</strong>
          </div>


          <div className="profile-info-row">
            <span>📧 Email</span>
            <strong>{user.email}</strong>
          </div>


          <div className="profile-info-row">
            <span>📖 Account</span>
            <strong>My Diary</strong>
          </div>

        </div>


        {/* Buttons */}
        <div className="profile-buttons">

          <button
            className="profile-home-btn"
            onClick={() => navigate("/home")}
          >
            🏠 Home
          </button>


          <button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;