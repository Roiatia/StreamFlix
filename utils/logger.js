const fs   = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');

// create logs/ automatically the first time this module is loaded
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const opsFile = path.join(logsDir, 'operations.log');
const errFile = path.join(logsDir, 'errors.log');

function ts() {
  return new Date().toISOString();
}

// log a successful operation — never pass passwords, tokens, cookies, or full bodies here
function logOperation(event, details) {
  fs.appendFileSync(opsFile, `[${ts()}] ${event} ${details}\n`);
}

// log an unexpected server error from a catch block
function logError(action, err) {
  fs.appendFileSync(errFile, `[${ts()}] ${action} — ${err.message}\n`);
}

module.exports = { logOperation, logError };
