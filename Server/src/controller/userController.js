const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const transporter = require("../services/mailer");
const authConfig = require("../config/auth.json");
const connection = require("../database/connection");

module.exports = {
  async register(req, res) {
    const { user, email, password } = req.body;

    const emailIsInUsage = await connection("users").where("email", email);

    if (emailIsInUsage.length !== 0)
      return res.json({ error: { email: "Email is in usage." } });

    try {
      const hash = await bcrypt.hash(password, 5);

      await connection("users")
        .insert({
          email,
          user,
          password: hash,
          confirmed: false,
        })
        .catch((err) => {
          throw err;
        });

      await sendConfirmationMail(email);

      return res.json({
        success: { message: "Email created, but you have to verify it." },
      });
    } catch (err) {
      return res.json({
        message: "An error occurred, try it once again later",
      });
    }
  },

  async emailValidate(req, res) {
    const { mailToken } = req.params;

    try {
      const { mail_id: email } = jwt.verify(mailToken, authConfig.mail_secret);

      await connection("users")
        .update({ confirmed: true })
        .where({ email: email });

      return res.redirect("http://localhost:3000/");
    } catch (err) {
      return res.status(401).json({ error: { message: "An error occurred." } });
    }
  },

  async reSendEmail(req, res) {
    const { email } = req.body;

    const emailNotYetVerified = await connection("users").where({
      email,
      confirmed: false,
    });

    if (emailNotYetVerified.length === 0)
      return res.json({
        error: { message: "Email is not registered or is already verified." },
      });

    await sendConfirmationMail(email);

    return res.json("success");
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await connection("users").where("email", email);

    if (user.length === 0)
      return res.json({ error: { email: "Email not registred." } });

    if (!(await bcrypt.compare(password, user[0].password)))
      return res.json({ error: { password: "Incorrect password." } });

    return res.json({
      token: generateToken({ id: user[0].id }, authConfig.secret),
      userData: {
        user: user[0].user,
        email,
      },
    });
  },

  tokenValidate: (req, res) => res.json("success"),
};

function generateToken(params = {}, secret) {
  return jwt.sign(params, secret, {
    expiresIn: 86400,
  });
}

function sendConfirmationMail(email) {
  const confirmationToken = generateToken(
    { mail_id: email },
    authConfig.mail_secret
  );

  let verifyLink = `http://localhost:3333/verify/${confirmationToken}`;

  transporter.sendMail(
    {
      from: "teste@teste.com.br",
      to: email,
      subject: "Verify your email",
      html: `<p>Welcome to kanban app, open this link to verify your email <a href=${verifyLink}>${verifyLink}</p>`,
    },
    (err, info) => {
      if (err) {
        throw err;
      }

      console.log("Email sent: " + info.response);
    }
  );
}
