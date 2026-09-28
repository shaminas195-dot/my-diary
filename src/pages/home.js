import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const bunnyImages = [
    "/bunny_01_hearts.png",
    "/bunny_02_big_heart.png",
    "/bunny_03_peeking.png",
    "/bunny_04_holding_heart.png",
    "/bunny_05_sleepy.png",
    "/bunny_06_sleeping.png",
    "/bunny_07_pillow.png",
    "/bunny_08_teddy_bear.png",
    "/bunny_09_flower_crown.png",
    "/bunny_10_bouquet.png",
    "/bunny_11_headphones.png",
    "/bunny_12_bubble_tea.png",
    "/bunny_13_peeking_side.png",
    "/bunny_14_excited.png",
    "/bunny_15_kiss.png",
    "/bunny_16_lying_down.png",
    "/bunny_17_cup.png",
    "/bunny_18_heart.png",
  ];

  // ==========================================
  // GET DIARY ENTRIES
  // ==========================================

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/diary/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEntries(data);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [navigate, user?.id]);


  // ==========================================
  // DELETE DIARY
  // ==========================================

  const deleteDiary = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this diary?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/diary/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setEntries(
          entries.filter((entry) => entry.id !== id)
        );

        setFavorites(
          favorites.filter((favoriteId) => favoriteId !== id)
        );
      }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };


  // ==========================================
  // FAVORITE
  // ==========================================

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(
        favorites.filter(
          (favoriteId) => favoriteId !== id
        )
      );
    } else {
      setFavorites([
        ...favorites,
        id,
      ]);
    }
  };


  // ==========================================
  // FILTER
  // ==========================================

  const filteredEntries = entries.filter((entry) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      entry.title
        ?.toLowerCase()
        .includes(searchText) ||
      entry.content
        ?.toLowerCase()
        .includes(searchText);

    const matchesMood =
      selectedMood === "All" ||
      entry.mood === selectedMood;

    return matchesSearch && matchesMood;
  });


  // ==========================================
  // MOOD EMOJI
  // ==========================================

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "Happy":
        return "😊";

      case "Sad":
        return "😢";

      case "Excited":
        return "✨";

      case "Calm":
        return "🌿";

      case "Angry":
        return "😡";

      case "Love":
        return "💙";

      default:
        return "💭";
    }
  };


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const newDate = new Date(date);

    return newDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  if (!user) {
    return null;
  }


  return (
    <div
      className="professional-home"
      style={{
        backgroundImage:
          "url('/home-bg.png')",
      }}
    >

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="sidebar-bunny-logo">
            🐰
          </div>

          <div>
            <h2>My Diary</h2>

            <p>
              A safe place for your thoughts ♡
            </p>
          </div>

        </div>


        <nav className="sidebar-menu">

          <button
            className="menu-item active"
            onClick={() => navigate("/home")}
          >
            <span>⌂</span>
            Home
          </button>


          <button
            className="menu-item"
            onClick={() =>
              navigate("/new-diary")
            }
          >
            <span>＋</span>
            New Diary
          </button>


          <button
            className="menu-item"
            onClick={() => {
              alert("Calendar feature coming soon!");
            }}
          >
            <span>▣</span>
            Calendar
          </button>


          <button
            className="menu-item"
            onClick={() => {
              setSelectedMood("All");

              if (favorites.length === 0) {
                alert("No favorite diaries yet.");
              }
            }}
          >
            <span>♡</span>
            Favorites
          </button>


          <button
            className="menu-item"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <span>♙</span>
            Profile
          </button>


          <button
            className="menu-item"
            onClick={() => {
              alert("Settings feature coming soon!");
            }}
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>


        <div className="sidebar-bottom">

          <button
            className="menu-item logout-menu"
            onClick={handleLogout}
          >
            <span>⇥</span>
            Logout
          </button>

        </div>


        <div className="sidebar-bunny">

          <img
            src="/bunny_01_hearts.png"
            alt="Cute bunny"
          />

          <p>
            Good Things
            <br />
            Take Time ♡
          </p>

        </div>

      </aside>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-content">


        {/* ==================================
            TOP BAR
        ================================== */}

        <header className="dashboard-topbar">

          <div></div>

          <div className="top-user">

            <span>
              Hi, {user.name} 👋
            </span>

            <div className="top-profile">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

          </div>

        </header>


        {/* ==================================
            HERO
        ================================== */}

        <section className="dashboard-hero">

          <div className="hero-text">

            <h1>
              Hello, {user.name}! 👋
            </h1>

            <h2>
              Write it. Feel it. Heal it. ♡
            </h2>

            <div className="hero-message">
              💙
              <span>
                A Happier You Is a Brighter Tomorrow
              </span>
              ♡
            </div>

          </div>


          <div className="hero-bunny">

            <img
              src="/bunny_04_holding_heart.png"
              alt="Cute bunny"
            />

          </div>


          <div className="hero-side-text">

            <strong>
              Small
              <br />
              moments
            </strong>

            <strong>
              Big happiness ♡
            </strong>

          </div>

        </section>


        {/* ==================================
            SEARCH + FILTER
        ================================== */}

        <section className="search-section">

          <div className="search-box">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search your diaries..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="mood-filters">

            <button
              className={
                selectedMood === "All"
                  ? "mood-filter active"
                  : "mood-filter"
              }
              onClick={() =>
                setSelectedMood("All")
              }
            >
              ▦ All
            </button>


            <button
              className={
                selectedMood === "Happy"
                  ? "mood-filter active"
                  : "mood-filter"
              }
              onClick={() =>
                setSelectedMood("Happy")
              }
            >
              😊 Happy
            </button>


            <button
              className={
                selectedMood === "Sad"
                  ? "mood-filter active"
                  : "mood-filter"
              }
              onClick={() =>
                setSelectedMood("Sad")
              }
            >
              😢 Sad
            </button>


            <button
              className={
                selectedMood === "Excited"
                  ? "mood-filter active"
                  : "mood-filter"
              }
              onClick={() =>
                setSelectedMood("Excited")
              }
            >
              ✨ Excited
            </button>


            <button
              className={
                selectedMood === "Calm"
                  ? "mood-filter active"
                  : "mood-filter"
              }
              onClick={() =>
                setSelectedMood("Calm")
              }
            >
              🌿 Calm
            </button>


            <button
              className={
                selectedMood === "Angry"
                  ? "mood-filter active"
                  : "mood-filter"
              }
              onClick={() =>
                setSelectedMood("Angry")
              }
            >
              😡 Angry
            </button>

          </div>


          <button
            className="dashboard-new-btn"
            onClick={() =>
              navigate("/new-diary")
            }
          >
            ＋ New Diary
          </button>

        </section>


        {/* ==================================
            ENTRIES
        ================================== */}

        <section className="entries-section">

          <div className="entries-heading">

            <div>

              <h2>
                My Memories
              </h2>

              <p>
                Your beautiful moments in one place ♡
              </p>

            </div>

            <span className="entry-count">
              {filteredEntries.length} Entries
            </span>

          </div>


          {filteredEntries.length === 0 ? (

            <div className="professional-empty">

              <img
                src="/bunny_07_pillow.png"
                alt="Cute bunny"
              />

              <h3>
                No memories found
              </h3>

              <p>
                Start writing your beautiful
                memories today.
              </p>

              <button
                className="dashboard-new-btn"
                onClick={() =>
                  navigate("/new-diary")
                }
              >
                ＋ Create Diary
              </button>

            </div>

          ) : (

            <div className="professional-diary-grid">

              {filteredEntries.map(
                (entry, index) => (

                  <article
                    className="professional-diary-card"
                    key={entry.id}
                  >

                    <div className="card-top">

                      <span className="card-date">
                        {formatDate(
                          entry.entry_date
                        )}
                      </span>

                      <span
                        className={`card-mood mood-${entry.mood?.toLowerCase()}`}
                      >
                        {getMoodEmoji(entry.mood)}
                        {" "}
                        {entry.mood || "Mood"}
                      </span>

                    </div>


                    <h3>
                      {entry.title}
                    </h3>


                    <p className="card-content">
                      {entry.content}
                    </p>


                    <div className="card-bottom">

                      <div className="card-actions">

                        <button
                          className={
                            favorites.includes(
                              entry.id
                            )
                              ? "card-action favorite-selected"
                              : "card-action"
                          }
                          onClick={() =>
                            toggleFavorite(
                              entry.id
                            )
                          }
                          title="Favorite"
                        >
                          {favorites.includes(
                            entry.id
                          )
                            ? "♥"
                            : "♡"}
                        </button>


                        <button
                          className="card-action"
                          onClick={() =>
                            navigate(
                              `/edit-diary/${entry.id}`
                            )
                          }
                          title="Edit"
                        >
                          ✎
                        </button>


                        <button
                          className="card-action delete-action"
                          onClick={() =>
                            deleteDiary(entry.id)
                          }
                          title="Delete"
                        >
                          ♧
                        </button>

                      </div>


                      <div className="card-bunny">

                        <img
                          src={
                            bunnyImages[
                              index %
                                bunnyImages.length
                            ]
                          }
                          alt="Diary bunny"
                        />

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* ==================================
            FOOTER
        ================================== */}

        <footer className="dashboard-footer">

          <span>
            © 2026 My Diary. All rights reserved.
          </span>

          <span>
            Be kind to your mind 💙
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Home;