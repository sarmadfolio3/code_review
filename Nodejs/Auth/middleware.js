import { decode } from "jsonwebtoken";
import { responseHandler } from "@/helpers/responseHandler";
import { isExpired, verifyJWT, verifySecretKey } from "@/utils/jwt";
import CONSTANTS from "@/utils/constants";

/*
 * This function is used as middleware to check if user session is valid or not
 * @param req, res, next
 * @returns {object}
 */
export const isAuthorized = (req, res, next) => {
  if (!req.headers.token)
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.UNAUTHORIZED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  if (isExpired(req.headers.token))
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.TOKEN_EXPIRED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  if (verifyJWT(req.headers.token)) {
    req.body.email = decode(req.headers.token).email;
    req.body.userId = decode(req.headers.token).id;
    next();
  } else {
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.UNAUTHORIZED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  }
};

/*
 * This function is used as middleware to check if the reset password link is valid or not
 * @param req, res, next
 * @returns json response
 */
export const checkResetPasswordLink = (req, res, next) => {
  if (!req.headers.tk)
    return res.json(
      responseHandler(
        "failed",
        CONSTANTS.MESSAGES.UNAUTHORIZED,
        null,
        CONSTANTS.STATUS_CODE.UNAUTHORIZED
      )
    );
  if (isExpired(req.headers.tk))
    return res.json(
      responseHandler(
        "failed",
        CONSTANTS.MESSAGES.TOKEN_EXPIRED,
        null,
        CONSTANTS.STATUS_CODE.UNAUTHORIZED
      )
    );
  const tk = verifyJWT(req.headers.tk);
  if (tk) {
    req.body.email = decode(req.headers.tk).email;
    next();
  } else {
    return res.json(
      responseHandler(
        "failed",
        CONSTANTS.MESSAGES.UNAUTHORIZED,
        null,
        CONSTANTS.STATUS_CODE.UNAUTHORIZED
      )
    );
  }
};

/*
 * This function is used as middleware to check if the user is authorized to change password
 * @param req, res, next
 * @returns json response
 */

export const isAuthorizedToChangePassword = (req, res, next) => {
  if (!req.headers.tk)
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.UNAUTHORIZED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  if (isExpired(req.headers.tk))
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.TOKEN_EXPIRED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  if (verifyJWT(req.headers.tk)) {
    req.body.email = decode(req.headers.tk).email;
    req.body.userId = decode(req.headers.tk).id;
    next();
  } else {
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.UNAUTHORIZED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  }
};

/*
 * This function is used as middleware to check if the request coming from another server is authorized or not
 * @param req, res, next
 * @returns json response
 */
export const isAuthorizedServerRequest = (req, res, next) => {
  if (!req.headers.secret)
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.UNAUTHORIZED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );

  if (verifySecretKey(req.headers.secret)) {
    next();
  } else {
    return res
      .status(CONSTANTS.STATUS_CODE.UNAUTHORIZED)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.UNAUTHORIZED,
          null,
          CONSTANTS.STATUS_CODE.UNAUTHORIZED
        )
      );
  }
};
