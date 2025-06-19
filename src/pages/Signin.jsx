import { useEffect, useReducer, useState } from "react";
import FuturisticLogo from "./components/FuturisticLogo";
import { validateEmail, validatePassword } from "../utills/validation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../contexts/UserProvider";

function formReducer(state, action) {
  switch (action.type) {
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}
async function signin(email, password, cb) {
  const res = await axios.post(
    "https://api.ecnet.website/api/signin",
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  cb();
  return res;
}
export default function Signin() {
  const { setIsAuthenticated, setToken } = useUserContext();
  const navigate = useNavigate();
  const [signing, setSigning] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [form, setForm] = useReducer(formReducer, {
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
    const isValid = form.email.valid && form.password.valid;
    if (formValid === isValid) {
      return;
    }
    if (isValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [form]);
  console.log("sign in rendered");
  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full">
        <div className="absolute min-h-screen inset-0 overflow-hidden">
          <img
            src="https://api.ecnet.website/images/login_background.webp"
            alt="Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute min-h-screen inset-0 bg-black/60 z-10" />
        <div className="relative items-center justify-between z-20 flex">
          <FuturisticLogo hover={true} />
        </div>
        <div className="px-8">
          <form className="bg-white/5 relative z-20 backdrop-blur-md p-8 rounded-xl shadow-xl max-w-md w-full mx-auto mt-10 space-y-6 text-left">
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
                className="w-full transition-colors focus:border-white hover:border-white duration-300 p-3 rounded-md bg-black/40 text-white placeholder-gray-400 border border-white/10 focus:outline-none ring-0]"
              />
              {!form.password.valid && (
                <span className="text-red-500">{form.password.error}</span>
              )}
            </div>

            <button
              onClick={async (e) => {
                e.preventDefault();
                setSigning(true);
                const res = await signin(
                  form.email.value,
                  form.password.value,
                  () => {
                    setSigning(false);
                  }
                );
                console.log(res.data);
                if (!res.data.success) {
                  setForm({
                    type: res.data.type,
                    payload: res.data.payload,
                  });
                  return;
                }
                setIsAuthenticated(true);
                setToken(res.data.token);
                navigate("/");
              }}
              disabled={formValid ? false : true}
              type="submit"
              className={`w-full ${
                !formValid
                  ? "hover:cursor-not-allowed bg-red-900"
                  : "bg-[var(--color-primary-start)] hover:bg-[var(--color-button-hover)] transition duration-300"
              } text-white py-3 px-6 rounded-lg font-bold select-none`}
            >
              {signing ? (
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="flex gap-1">
              <div className="text-[#ffffffb3] select-none">
                New to Streamix?
              </div>
              <div
                onClick={() => navigate("/register")}
                className="text-white hover:cursor-pointer font-bold"
              >
                Register now.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
