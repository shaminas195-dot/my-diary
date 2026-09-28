import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "./App.css";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import NewDiary from "./pages/NewDiary";
import EditDiary from "./pages/EditDiary";
import Profile from"./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/new-diary"
          element={<NewDiary />}
        />

        <Route
          path="/edit-diary/:id"
          element={<EditDiary />}
        />
        <Route
  path="/profile"
  element={<Profile />}
/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;