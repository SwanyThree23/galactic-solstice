"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AiController_1 = require("../controllers/AiController");
const router = (0, express_1.Router)();
router.post('/query', AiController_1.aiController.query);
router.post('/swarm/:id', AiController_1.aiController.swarm);
router.post('/tts', AiController_1.aiController.tts);
exports.default = router;
