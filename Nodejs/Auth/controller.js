import _ from "lodash";
import { sign } from "jsonwebtoken";
import { responseHandler } from "@/helpers/responseHandler";
import { decrypt_value, encrypt_value } from "@/utils/crypto";
import { forgotPasswordEmail, sendEmail } from "@/helpers/email";
import { isExpired, verifyJWT } from "@/utils/jwt";
import Organizations from "@/models/Organizations";
import UserRoles from "@/models/UserRoles";
import { ResetTokens } from "@/models";
import Roles from "@/models/Roles";
import Users from "@/models/Users";
import CONSTANTS from "@/utils/constants";

/*
 * This function is used to login user
 * @param email, password
 * @returns {object}
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(403)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.MANDATORY_FIELDS,
          null,
          403
        )
      );
  }
  try {
    const response = await Users.findOne({
      where: { email: email.toLowerCase() },
      include: [
        {
          model: Organizations,
          attributes: ["name", "logo_url", "id"],
        },
      ],
    });
    if (!_.isEmpty(response)) {
      if (decrypt_value(response.password) !== JSON.stringify(password)) {
        return res
          .status(400)
          .json(
            responseHandler(
              "failed",
              CONSTANTS.MESSAGES.INVALID_CREDENTIALS,
              null,
              400
            )
          );
      } else {
        const userRoles = await UserRoles.findAll({
          attributes: ["id", "role_id"],

          where: { user_id: response.id },
          include: [
            {
              model: Roles,
              attributes: ["name", "permissions", "id"],
            },
          ],
        });

        const token = sign(
          { id: response.id, email: response.email },
          process.env.JWT_ENCRYPTION_KEY,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        const data = {
          email: response.email,
          id: response.id,
          first_name: response.first_name,
          last_name: response.last_name,
          jwt: token,
          organization: response.organization,
          roles: userRoles,
        };
        return res.json(
          responseHandler(
            "success",
            CONSTANTS.MESSAGES.LOGIN_SUCCESS,
            data,
            200
          )
        );
      }
    }
    return res
      .status(404)
      .json(
        responseHandler("failed", CONSTANTS.MESSAGES.USER_NOT_FOUND, null, 404)
      );
  } catch (ex) {
    return res.status(500).json(responseHandler("failed", ex));
  }
};

/*
 * @desc: This function is used to forgot password and send email to user
 * @param: email - email of user
 * @return: json response with status code and message
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const response = await Users.findOne({ where: { email } });
    if (_.isEmpty(response))
      return res
        .status(404)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.USER_NOT_FOUND,
            null,
            404
          )
        );
    const token = sign(
      { email: response.email },
      process.env.JWT_ENCRYPTION_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    await ResetTokens.create({
      email,
      token,
    });
    await sendEmail(
      forgotPasswordEmail(
        email,
        response.first_name,
        `${process.env.VERIFICATION_URL}?token=${token}`
      ),
      {
        email,
        subject: CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD,
      }
    );
    res.json(
      responseHandler("success", CONSTANTS.MESSAGES.EMAIL_SENT, null, 200)
    );
  } catch (ex) {
    return res.status(500).json(responseHandler("failed", ex, null, 500));
  }
};

/*
 * @desc: This function is used to verify the token
 * @param: clientToken
 * @return: json response with status code and message
 */

export const verifyResetPasswordLink = async (req, res) => {
  const { clientToken } = req.query;
  try {
    if (isExpired(clientToken)) {
      return res
        .status(400)
        .send(responseHandler("failed", CONSTANTS.MESSAGES.TOKEN_EXPIRED));
    } else {
      const checkTokenInDB = await ResetTokens.findOne({
        token: clientToken,
      });
      if (_.isEmpty(checkTokenInDB)) {
        return res
          .status(400)
          .send(responseHandler("failed", CONSTANTS.MESSAGES.TOKEN_NOT_FOUND));
      }
      const check = verifyJWT(tk);
      if (check) {
        res.redirect(
          `${process.env.CLIENT_URL}${CONSTANTS.URLS.RESET_TOKEN}?token=${clientToken}`
        );
      } else {
        return res
          .status(400)
          .send(
            responseHandler("failed", CONSTANTS.MESSAGES.VERIFICATION_FAILED)
          );
      }
    }
  } catch (ex) {
    return res.status(500).json(responseHandler("failed", ex, null, 500));
  }
};

/*
 * @desc: This function is used to reset password
 * @param: token, password
 * @return: json response with status code and message
 */
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!password)
      return res
        .status(400)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.PASSWORD_REQUIRED,
            null,
            400
          )
        );
    const response = await Users.findOne({ where: { email } });
    if (_.isEmpty(response))
      return res
        .status(404)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.USER_NOT_FOUND,
            null,
            404
          )
        );
    await response.update({
      password: encrypt_value(password),
    });
    const responseResetToken = await ResetTokens.findOne({
      where: {
        email,
      },
    });
    if (!_.isEmpty(responseResetToken)) {
      await responseResetToken.destroy();
    }
    res.json(
      responseHandler("success", CONSTANTS.MESSAGES.PASSWORD_UPDATED, null, 200)
    );
  } catch (ex) {
    return res
      .status(500)
      .json(
        responseHandler("failed", CONSTANTS.MESSAGES.INTERNAL_ERROR, null, 500)
      );
  }
};

/*
 * @desc: This function is used change password of user
 * @param: email, old_password, new_password
 * @return: json response with status code and message
 */

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const response = await Users.findOne({ email });
    if (_.isEmpty(response))
      return res
        .status(404)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.USER_NOT_FOUND,
            null,
            404
          )
        );
    if (decrypt_value(response.password) !== JSON.stringify(oldPassword))
      return res.json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.INVALID_PASSWORD,
          null,
          400
        )
      );
    await response.update({
      password: encrypt_value(newPassword),
    });
    return res.json(
      responseHandler("success", CONSTANTS.MESSAGES.PASSWORD_CHANGED, null, 200)
    );
  } catch (ex) {
    return res
      .status(500)
      .json(
        responseHandler(
          "failed",
          CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG,
          null,
          500
        )
      );
  }
};

/*
 * @desc: This function is used to register a new user
 * @param: email, first_name, last_name, password, organization_id
 * @return: json response with status code and message
 */
export const register = async (req, res) => {
  let { email, password, first_name, last_name, organization_id } = req.body;
  try {
    const isExists = await Users.findOne({
      where: { email },
    });
    if (!_.isEmpty(isExists)) {
      return res
        .status(403)
        .json(
          responseHandler("failed", CONSTANTS.MESSAGES.EMAIL_EXISTS, null, 403)
        );
    } else {
      const created = await Users.create({
        email: email.toLowerCase(),
        password: encrypt_value(password),
        first_name,
        last_name,
        organization_id,
      });

      const role = await Roles.findOne({
        where: { name: CONSTANTS.ROLES.CONTRACT_INVOICE_MANAGER },
      });
      if (!_.isEmpty(role)) {
        await UserRoles.create({
          user_id: created.id,
          role_id: role.id,
        });
      }

      const data = {
        id: created.id,
        first_name: created.first_name,
        last_name: created.last_name,
        email: created.email,
        organization_id: created.organization_id,
      };
      return res.json(
        responseHandler(
          "success",
          CONSTANTS.MESSAGES.REGISTER_SUCCESS,
          data,
          200
        )
      );
    }
  } catch (error) {
    return res.status(500).json(responseHandler("failed", error, null, 500));
  }
};
