const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

module.exports = router;
