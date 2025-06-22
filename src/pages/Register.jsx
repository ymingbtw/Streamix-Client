import { useState, useReducer, useEffect } from "react";
import FuturisticLogo from "./components/FuturisticLogo";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../utills/validation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function formReducer(state, action) {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}
async function register(name, email, password, cb) {
  const res = await axios.post(
    "https://api.ecnet.website/api/register",
    { name, email, password },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  cb();
  return res;
}

export default function Register() {
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [form, setForm] = useReducer(formReducer, {
    name: {
      value: "",
      valid: false,
      error: null,
    },
    email: {
      value: "",
      valid: false,
      error: null,
    },
    password: {
      value: "",
      valid: false,
      error: null,
    },
  });
  useEffect(() => {
    const isValid = form.name.valid && form.email.valid && form.password.valid;
    if (formValid === isValid) {
      return;
    }
    if (isValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [form]);
  console.log("register rendered");
  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full">
        <div className="absolute min-h-screen inset-0 overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-700 to-blue-500"></div>

        <div className="absolute min-h-screen inset-0 bg-black/60 z-10" />
        <div className="relative items-center justify-between z-20 flex">
          <FuturisticLogo />
          <div className="pr-[1rem]">
            <button
              onClick={() => {
                navigate("/signin");
              }}
              className="bg-gradient-to-r from-indigo-700 via-blue-500 to-purple-700 shadow-md hover:from-blue-600 hover:to-indigo-800 hover:cursor-pointer select-none transition-colors duration-300 font-bold px-[1rem] py-[0.3rem] rounded-sm  text-white"
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="px-8">
          <form className="bg-white/5 relative z-20 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-md w-full mx-auto mt-10 space-y-6 text-left">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Name
              </label>
              <input
                onBlur={(e) => {
                  validateName(e.currentTarget.value, setForm);
                }}
                defaultValue={form.name.value}
                type="text"
                placeholder="Your Name"
                className="w-full transition-colors focus:border-white hover:border-white duration-300 p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none ring-0]"
              />
              {!form.name.valid && (
                <span className="text-red-500">{form.name.error}</span>
              )}
            </div>

            <div className="text-white">
              <label className="block text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                defaultValue={form.email.value}
                onBlur={(e) => {
                  validateEmail(e.currentTarget.value, setForm);
                }}
                type="email"
                placeholder="you@domain.com"
                className="w-full focus:border-white transition-colors hover:border-white duration-300 p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none ring-0]"
              />
              {!form.email.valid && (
                <span className="text-red-500 p-1">{form.email.error}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Password
              </label>
              <input
                onBlur={(e) => {
                  validatePassword(e.currentTarget.value, setForm);
                }}
                defaultValue={form.password.value}
                type="password"
                placeholder="••••••••"
                className="w-full focus:border-white transition-colors hover:border-white duration-300 p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none ring-0]"
              />
              {!form.password.valid && (
                <span className="text-red-500">{form.password.error}</span>
              )}
            </div>

            <button
              onClick={async (e) => {
                e.preventDefault();
                setRegistering(true);
                const res = await register(
                  form.name.value,
                  form.email.value,
                  form.password.value,
                  () => {
                    setRegistering(false);
                  }
                );
                if (res.data.success) {
                  navigate("/signin", { replace: true });
                  return;
                }
                setForm({ type: res.data.type, payload: res.data.payload });
                console.log(res.data);
              }}
              disabled={formValid ? false : true}
              className={`w-full ${
                !formValid
                  ? "hover:cursor-not-allowed bg-gradient-to-r from-indigo-700/50 via-blue-500/50 to-purple-700/50"
                  : "bg-gradient-to-r from-indigo-700 via-blue-500 to-purple-700 shadow-md hover:from-blue-600 hover:to-indigo-800 transition duration-300"
              } text-white py-3 px-6 rounded-lg font-bold select-none`}
            >
              {registering ? (
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
