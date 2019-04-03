const router = require('express').Router();
const bcrypt = require('bcryptjs');
//Brings in jsonwebtoken library
const jwt = require('jsonwebtoken');
//Brings in secret token from secrets file
const secret = require('../api/secrets.js').jwtSecret
const Users = require('../users/usersModel.js');
const restricted = require('./restricted-middleware.js')


//Creates jwt(jsonwebtoken)
const generateToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };
  const options = {
    expiresIn: '10m'
  }
  return jwt.sign(payload, secret, options)
}

// Endpoints
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); 
  user.password = hash;

  Users.addUser(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});


router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //generates the webtoken for the user.
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});



router.get('/users', restricted, (req, res) => {
  Users.findUser()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});


module.exports = router;