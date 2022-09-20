const express = require('express');
const router = express.Router();

router.use(require('./departnemtRoutes'));
router.use(require('./employeesRoutes'));
router.use(require('./rolesRoutes'));

module.exports = router;