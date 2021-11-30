import _ from "lodash";
import { responseHandler } from "@/helpers/responseHandler";
import CONSTANTS from "@/utils/constants";
import Users from "@/models/Users";
import Documents from "@/models/Documents";
import Contracts from "@/models/Contracts";
import Invoices from "@/models/Invoices";
import POs from "@/models/PO";
import { getSignedUrl } from "@/utils/s3Upload";
import { runPythonScript } from "@/python-scripts/run-scripts";

/*
 * This function is used to get all Documents
 * @param req, res
 * @returns {object}
 */
export const gettAll = async (req, res) => {
  try {
    const documents = await Documents.findAll({
      include: {
        model: Users,
        attributes: ["first_name", "last_name"],
      },
    });

    return res
      .status(200)
      .json(
        responseHandler("success", CONSTANTS.MESSAGES.SUCCESS, documents, 200)
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, ex, 500));
  }
};

/*
 * This function is used create a new Document
 * @param req, res
 * @returns {object}
 */
export const create = async (req, res) => {
  let { user_id, type } = req.body;
  try {
    if (!user_id || !type) {
      return res
        .status(400)
        .json(
          responseHandler("failed", CONSTANTS.MESSAGES.FILL_ALL_FIELDS, "", 400)
        );
    } else {
      const created = await Documents.create({
        user_id,
        type,
      });

      return res.json(
        responseHandler("success", CONSTANTS.MESSAGES.SUCCESS, created, 200)
      );
    }
  } catch (error) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, error, 500));
  }
};

/*
 * This function is used to create contracts in bulk
 * @param req, res
 * @returns {object}
 */

export const uploadContractFile = async (req, res) => {
  try {
    let returnBody = [];
    if (req.body.length < 1) {
      return res
        .status(400)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.NO_FILE_SELECTED,
            "",
            400
          )
        );
    }
    let i = 0;
    do {
      const created = await Documents.create({
        user_id: req.body[i].user_id,
        type: req.body[i].type,
        key: req.body[i].key,
        name: req.body[i].name,
      });
      const contracts = await Contracts.findOne({
        where: { id: req.body[i].contract_id },
      });
      const updatedContract = await contracts.update({
        document_id: created.id,
      });
      returnBody.push({
        ...updatedContract.dataValues,
      });
      i++;
    } while (i < req.body.length);
    return res
      .status(200)
      .json(
        responseHandler("success", CONSTANTS.MESSAGES.SUCCESS, returnBody, 200)
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, ex, 500));
  }
};

/*
 * This function is used to upload PO files in bulk
 * @param req, res
 * @returns {object}
 */
export const uploadInvoiceFile = async (req, res) => {
  try {
    let returnBody = [];
    if (req.body.length < 1) {
      return res
        .status(400)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.NO_FILE_SELECTED,
            "",
            400
          )
        );
    }
    let i = 0;
    do {
      const created = await Documents.create({
        user_id: req.body[i].user_id,
        type: req.body[i].type,
        key: req.body[i].key,
        name: req.body[i].name,
      });
      const invoice = await Invoices.findOne({
        where: { id: req.body[i].invoice_id },
      });
      const updateInvoice = await invoice.update({
        document_id: created.id,
      });
      returnBody.push({
        ...updateInvoice.dataValues,
      });
      i++;
    } while (i < req.body.length);
    runPythonScript("invoice");
    return res
      .status(200)
      .json(
        responseHandler("success", CONSTANTS.MESSAGES.SUCCESS, returnBody, 200)
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", ConSTANTS.MESSAGES.FAILED, ex, 500));
  }
};

/*
 * This function is used to upload PO file
 * @param req, res
 * @returns {object}
 */
export const uploadPO = async (req, res) => {
  try {
    let returnBody = [];
    if (req.body.length < 1) {
      return res
        .status(400)
        .json(
          responseHandler(
            "failed",
            CONSTANTS.MESSAGES.NO_FILE_SELECTED,
            "",
            400
          )
        );
    }
    let i = 0;
    do {
      const created = await Documents.create({
        user_id: req.body[i].user_id,
        type: req.body[i].type,
        key: req.body[i].key,
        name: req.body[i].name,
      });
      const po = await POs.findOne({
        where: { id: req.body[i].po_id },
      });
      const updatePo = await po.update({
        document_id: created.id,
      });
      returnBody.push({
        ...updatePo.dataValues,
      });
      i++;
    } while (i < req.body.length);
    runPythonScript("po");
    return res
      .status(200)
      .json(
        responseHandler("success", CONSTANTS.MESSAGES.SUCCESS, returnBody, 200)
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, ex, 500));
  }
};

/*
 * This function is used to get signed url for upload contract
 * @param req, res
 * @returns {object}
 */

export const getContractFile = async (req, res) => {
  try {
    const signedUrl = await getSignedUrl(
      "getObject",
      `contracts/${req.params.key}`
    );
    return res
      .status(200)
      .json(
        responseHandler(
          "success",
          CONSTANTS.MESSAGES.SIGNED_URL_SUCCESS,
          signedUrl,
          200
        )
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, ex, 500));
  }
};

/*
 * This function is used to get signed url for upload invoice
 * @param req, res
 * @returns {object}
 */

export const getPOfile = async (req, res) => {
  try {
    const signedUrl = await getSignedUrl(
      "getObject",
      `purchase_orders/${req.params.key}`
    );
    return res
      .status(200)
      .json(
        responseHandler(
          "success",
          CONSTANTS.MESSAGES.SIGNED_URL_SUCCESS,
          signedUrl,
          200
        )
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, ex, 500));
  }
};

/*
 * This function is used to get signed url for upload invoice
 * @param req, res
 * @returns {object}
 */
export const getInvoiceFile = async (req, res) => {
  try {
    const signedUrl = await getSignedUrl(
      "getObject",
      `invoices/${req.params.key}`
    );
    return res
      .status(200)
      .json(
        responseHandler(
          "success",
          CONSTANTS.MESSAGES.SIGNED_URL_SUCCESS,
          signedUrl,
          200
        )
      );
  } catch (ex) {
    return res
      .status(500)
      .json(responseHandler("failed", CONSTANTS.MESSAGES.FAILED, ex, 500));
  }
};
