const https = require("https");
const url = process.argv[2];
const token = process.argv[3];
const maxRetries = 4;

if (!url || !token) {
  process.stderr.write("Usage: node fetch-tmdb.cjs <url> <token>");
  process.exit(1);
}

function doRequest(attempt = 1) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { family: 4, headers: { Authorization: "Bearer " + token } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 100)}`));
          } else {
            resolve(data);
          }
        });
      }
    );
    req.on("error", (e) => {
      if (attempt < maxRetries) {
        const delay = Math.min(attempt * 1500, 5000);
        setTimeout(() => {
          doRequest(attempt + 1).then(resolve).catch(reject);
        }, delay);
      } else {
        reject(e);
      }
    });
    req.end();
  });
}

doRequest()
  .then((data) => {
    process.stdout.write(data);
    process.exit(0);
  })
  .catch((e) => {
    process.stderr.write(e.code || e.message);
    process.exit(1);
  });
