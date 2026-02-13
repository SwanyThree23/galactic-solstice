"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AnalyticsController_1 = require("../controllers/AnalyticsController");
const router = (0, express_1.Router)();
router.get('/stream/:id', AnalyticsController_1.analyticsController.getStreamData);
router.get('/creator/:userId', AnalyticsController_1.analyticsController.getCreatorData);
router.post('/track', AnalyticsController_1.analyticsController.track);
exports.default = router;
