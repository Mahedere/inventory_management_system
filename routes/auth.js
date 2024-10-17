const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { users } = require("../db");
router.post(
  "/signup",
  [
    check("email", "Please provide a vaild email").isEmail(),
    check(
      "password",
      "Please provide a password that is greater than 5 characters"
    ).isLength({
      min: 6,
    }),
  ],
  (req, res) => {
    const { password, email } = req.body;
    //Validates the Input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //validates if user doesn't already exist
    let user = users.find((user) => {
      return user.email === email;
    });
    if (user) {
      res.status(400).json({
        errors: [
          {
            msg: "This user already exists",
          },
        ],
      });
    }
    res.send("Validation Passed");
  }
);

module.exports = router;
