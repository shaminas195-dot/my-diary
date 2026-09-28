import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditDiary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [entryDate, setEntryDate] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // Get selected diary
  useEffect(() => {
    if (!user || !user.id) {
      alert("User ID not found. Please logout and login again.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/diary/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          return;
        }

        const diary = data.find(
          (entry) => entry.id === Number(id)
        );

        if (diary) {
          setTitle(diary.title);
          setMood(diary.mood || "");
          setContent(diary.content);

          const date = new Date(diary.entry_date);

          setEntryDate(
            date.toISOString().split("T")[0]
          );
        } else {
          alert("Diary entry not found");
          navigate("/home");
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [id, navigate, user?.id]);


  // Update diary
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !entryDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/diary/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
      console.log("Update error:", error);

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

        {/* Bunny */}
        <div className="form-icon">
          🐰
        </div>


        {/* Heading */}
        <h1>
          Edit Your Diary ✏️
        </h1>


        <p className="form-subtitle">
          Update your thoughts and memories 💙
        </p>


        <form onSubmit={handleSubmit}>

          {/* Title */}

          <label>
            Diary Title
          </label>

          <input
            type="text"
            placeholder="Enter diary title..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />


          {/* Mood */}

          <label>
            Mood
          </label>

          <select
            value={mood}
            onChange={(e) =>
              setMood(e.target.value)
            }
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


          {/* Content */}

          <label>
            Diary Content
          </label>

          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            rows="10"
          />


          {/* Date */}

          <label>
            Date
          </label>

          <input
            type="date"
            value={entryDate}
            onChange={(e) =>
              setEntryDate(e.target.value)
            }
          />


          {/* Buttons */}

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
              ✏️ Update Diary
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditDiary;