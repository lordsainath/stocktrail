import express from "express";
import * as controller from "../controllers/location.controller.js";

const router = express.Router();

router.get("/countries", controller.getCountries);
router.get("/states", controller.getStates);
router.get("/cities", controller.getCities);

export default router;
