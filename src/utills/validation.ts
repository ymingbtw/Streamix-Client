export function validateEmail(email: any, setForm: any) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    setForm({
      type: "email",
      payload: {
        value: email,
        valid: false,
        error: "Please enter a valid email address.",
      },
    });
    return;
  }
  setForm({
    type: "email",
    payload: {
      value: email,
      valid: true,
      error: null,
    },
  });
}
export function validateName(name: any, setForm: any) {
  const trimmed = name.trim();
  let error = "";
  let valid = true;
  if (trimmed.length < 3 || trimmed.length > 20) {
    error = "Name must be between 3 and 20 characters.";
    valid = false;
  } else if (!/^[A-Za-z ]+$/.test(trimmed)) {
    error = "Name can only contain letters and spaces.";
    valid = false;
  }
  setForm({
    type: "name",
    payload: {
      value: name,
      valid,
      error,
    },
  });
}
export function validatePassword(password: any, setForm: any) {
  let valid = true;
  let error = "";
  if (password.length < 8) {
    valid = false;
    error = "Password must be at least 8 characters long.";
  } else if (!/[a-z]/.test(password)) {
    valid = false;
    error = "Password must contain at least one lowercase letter.";
  } else if (!/[A-Z]/.test(password)) {
    valid = false;
    error = "Password must contain at least one uppercase letter.";
  } else if (!/[0-9]/.test(password)) {
    valid = false;
    error = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    valid = false;
    error = "Password must contain at least one special character.";
  }
  setForm({
    type: "password",
    payload: {
      value: password,
      valid,
      error,
    },
  });
}
