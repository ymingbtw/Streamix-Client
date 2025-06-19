import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useUserContext } from "../../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { token, setIsAuthenticated, setToken } = useUserContext();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  async function onLogout() {
    const res = await axios.post(
      "https://api.ecnet.website/api/signout",
      {
        token,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setIsAuthenticated(false);
      setToken(null);
    }
  }

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex hover:cursor-pointer items-center gap-2 text-white hover:opacity-80"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="profile"
          className="size-[2rem] rounded"
        />
        <FaCaretDown />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded shadow-lg z-50">
          <ul className="py-1 text-sm text-white">
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  // Navigate to profile page
                  navigate("/profile");
                }}
                className="block hover:cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-800"
              >
                Manage Profiles
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout(); // or use your auth logout logic
                }}
                className="block hover:cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-800"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
