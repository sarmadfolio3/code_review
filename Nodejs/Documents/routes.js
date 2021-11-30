import { Router } from "express";
import { isAuthorized, isAuthorizedServerRequest } from "@/Auth/middleware";
import {
  create,
  getContractFile,
  gettAll,
  uploadContractFile,
  uploadInvoiceFile,
  uploadPO,
  getPOfile,
  getInvoiceFile,
} from "./controller";
const router = Router();

/* 
  * Documents Routes
*/
router.post("/documents/create", isAuthorized, create);
router.get("/documents/getAll", isAuthorized, gettAll);
router.post("/documents/contract/upload", isAuthorized, uploadContractFile);
router.post("/documents/invoice/upload", isAuthorized, uploadInvoiceFile);
router.post("/documents/po/upload", isAuthorized, uploadPO);
router.get("/documents/contracts/file/:key", isAuthorized, getContractFile);
router.get("/documents/po/file/:key", isAuthorized, getPOfile);
router.get("/documents/invoice/file/:key", isAuthorized, getInvoiceFile);

/* 
  * Routes for server requests
*/
router.get(
  "/parsing/documents/contracts/file/:key",
  isAuthorizedServerRequest,
  getContractFile
);
router.get(
  "/parsing/documents/po/file/:key",
  isAuthorizedServerRequest,
  getPOfile
);
router.get(
  "/parsing/documents/invoice/file/:key",
  isAuthorizedServerRequest,
  getInvoiceFile
);

export { router };
