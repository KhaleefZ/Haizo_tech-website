const { URL } = require('url');

function matchRemotePattern(pattern, url) {
  try {
    const parsedUrl = new URL(url);
    if (pattern.protocol && pattern.protocol !== parsedUrl.protocol.slice(0, -1)) return false;
    if (pattern.hostname && pattern.hostname !== parsedUrl.hostname) return false;
    if (pattern.port && pattern.port !== parsedUrl.port) return false;
    // We didn't specify pathname, so it defaults to ** which matches everything
    return true;
  } catch (e) {
    return false;
  }
}

const pattern = { protocol: 'http', hostname: 'localhost', port: '5001' };
const url = 'http://localhost:5001/uploads/de9840da-5ec8-4e90-8337-92a139fae9e6.png';

console.log("Matches?", matchRemotePattern(pattern, url));
