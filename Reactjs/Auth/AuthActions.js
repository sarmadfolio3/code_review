import { login } from "@/Services/Auth/auth";
import { saveToLocal } from "@/utils/cache";
import { LOCAL_STORAGE_KEYS } from "@/utils/constants";
import {
  HIDE_LOADER,
  SHOW_LOADER,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  SIGNIN_FAILURE,
  SIGNIN_SUCCESS,
} from "@/Types";
import { actionDispatch, triggerNotification } from "@/actions";
import history from "@/History/history";
import {
  RESET_PASSWORD_SUCCESS,
  SIGNIN_FAILURE_MSG,
  RESET_PASSWORD_FAILED,
} from "@/Constants/validation";
import {
  forgotUserPassword,
  resetUserPassword,
} from "@/Services/Auth/auth";
import {
    CODE_SUCCESS
} from "@/Constants/validation";


/********************************
    * Actions to be dispatched when user clicks on Login button
    * @param {object} payload
    * @returns {undefined}
 ********************************/
export const signIn = (data) => async (dispatch) => {
  dispatch(actionDispatch(SHOW_LOADER, { loader: true }));
  dispatch(actionDispatch(HIDE_NOTIFICATION));
  try {
    const res = await login(data);
    if (res.code === CODE_SUCCESS) {
      const {
        data: { user, jwt, roles },
      } = res;
      saveToLocal(jwt, LOCAL_STORAGE_KEYS.TOKEN, false, true);
      saveToLocal(data, LOCAL_STORAGE_KEYS.USER, true, true);
      saveToLocal(roles, LOCAL_STORAGE_KEYS.ROLES, true, true);
      dispatch(
        actionDispatch(SIGNIN_SUCCESS, {
          user,
          jwt,
          roles,
        })
      );
      history.push("/");
    } else {
      dispatch(actionDispatch(SIGNIN_FAILURE));
      dispatch(
        actionDispatch(SHOW_NOTIFICATION, {
          message: res.message,
          open: true,
          type: "error",
        })
      );
    }
    dispatch(actionDispatch(HIDE_LOADER));
  } catch (ex) {
    dispatch(actionDispatch(HIDE_LOADER));
    dispatch(
      actionDispatch(SHOW_NOTIFICATION, {
        message:
          ex.response && ex.response.data
            ? ex.response.data.message
            : SIGNIN_FAILURE_MSG,
        open: true,
        type: "error",
      })
    );
  }
};

/********************************
    * Actions to be dispatched when user clicks on Forgot Password button
    * @param {object} payload
    * @returns {undefined}
 ********************************/

export const forgotPassword = (data) => async (dispatch) => {
  dispatch(actionDispatch(SHOW_LOADER, { loader: true }));
  try {
    const res = await forgotUserPassword(data);
    dispatch(actionDispatch(HIDE_LOADER));
    if (res && res.success) {
      dispatch(
        actionDispatch(SHOW_NOTIFICATION, {
          message: `${RESET_PASSWORD_SUCCESS}`,
          open: true,
          type: "success",
        })
      );
    } else {
      dispatch(
        actionDispatch(SHOW_NOTIFICATION, {
          message: res.msg ? res.msg : RESET_PASSWORD_FAILED,
          open: true,
          type: "error",
        })
      );
    }
  } catch (ex) {
    dispatch(actionDispatch(HIDE_LOADER));
    dispatch(
      actionDispatch(SHOW_NOTIFICATION, {
        message:
          ex.response && ex.response.data
            ? ex.response.data.message
            : RESET_PASSWORD_FAILED,
        open: true,
        type: "error",
      })
    );
  }
};

/********************************
    * Actions to be dispatched when user clicks on Reset Password button
    * @param {object} payload
    * @param {string} payload.token
    * @returns {undefined}
 ********************************/

export const resetPassword = (data, token) => async (dispatch) => {
  dispatch(actionDispatch(SHOW_LOADER, { loader: true }));
  try {
    const res = await resetUserPassword(data, { tk: token });
    dispatch(actionDispatch(HIDE_LOADER));
    dispatch(triggerNotification("success", res.message));
    history.push("/");
  } catch (ex) {
    dispatch(actionDispatch(HIDE_LOADER));
    dispatch(triggerNotification("error", ex.message));
  }
};
