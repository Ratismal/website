const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const secret = config.jwtSecret;

class Security {
  constructor(client) {
    this.client = client;
  }

  static generateToken(id, opts = {}, expires = true, invalidate = false) {
    // opts is put directly into the jwt payload
    let payload = {
      ...opts,
      id
    };

    const token = jwt.sign(payload, secret);

    return token;
  }

  static validateToken(token) {
    try {
      const user = jwt.verify(token, secret);
      return user;
    } catch (err) {
      return null;
    }
  }
}

module.exports = Security;