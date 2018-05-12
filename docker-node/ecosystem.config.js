//this file configures pm2 which is used to run, daemonize and monitor node.
module.exports = {
  apps : [{
    name        : "docker-node",
    script      : "./src/index.js",
    watch       : true,
    env: {
      "NODE_ENV": "development",
      "DB_HOST": "localhost",
      "DB_USER": "root",
      "DB_PASS": "example",
      "JWT_SECRET":"secretphrase",
      "JWT_MAX_AGE":60
    }
  }]
}
