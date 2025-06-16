// actions/userActions.js

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_UPDATE_PROFILE = "USER_UPDATE_PROFILE";

export const loginUser = (token, profile) => ({
  type: USER_LOGIN,
  payload: { token, profile },
});

export const logoutUser = () => ({
  type: USER_LOGOUT,
});

export const updateUserProfile = (profileUpdates) => ({
  type: USER_UPDATE_PROFILE,
  payload: profileUpdates,
});
