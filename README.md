# 24Snack Manual — protected site

Static site for GitHub Pages. Manual content is AES-256-GCM encrypted (`data.enc.json`);
it decrypts in the browser with the team passcode. Built by `scripts/build_site.js` in the private repo.
To rotate the passcode: rebuild with a new passcode and push.
