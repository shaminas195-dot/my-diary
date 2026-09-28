import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewDiary() {
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [entryDate, setEntryDate] = useState("");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("User ID not found. Please logout and login again.");
      return;
    }

    if (!title || !content || !entryDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/diary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            title: title,
            mood: mood,
            content: content,
            entry_date: entryDate,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/home");
      }
    } catch (error) {
      console.log("Diary error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div
      className="new-diary-page"
      style={{
        backgroundImage: "url('/home-bg.png')",
      }}
    >
      <div className="diary-form-card">

        <div className="form-icon">
          🐰
        </div>

        <h1>Write a New Diary 💙</h1>

        <p className="form-subtitle">
          Capture your thoughts, feelings and beautiful memories ✨
        </p>

        <form onSubmit={handleSubmit}>

          <label>Diary Title</label>

          <input
            type="text"
            placeholder="Give your diary a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />


          <label>Mood</label>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">
              Select your mood
            </option>

            <option value="Happy">
              😊 Happy
            </option>

            <option value="Sad">
              😢 Sad
            </option>

            <option value="Excited">
              ✨ Excited
            </option>

            <option value="Calm">
              🌿 Calm
            </option>

            <option value="Angry">
              😡 Angry
            </option>
          </select>


          <label>Diary Content</label>

          <textarea
            placeholder="Write about your day..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
          />


          <label>Date</label>

          <input
            type="date"
            value={entryDate}
            onChange={(e) =>
              setEntryDate(e.target.value)
            }
          />


          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/home")
              }
            >
              ← Cancel
            </button>


            <button
              type="submit"
              className="save-btn"
            >
              💾 Save Diary
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default NewDiary;