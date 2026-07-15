fetch("https://api.github.com/repos/vercel/next.js/issues?state=all&q=resolved+to+private+ip", {
  headers: { "User-Agent": "Node.js" }
}).then(r => r.json()).then(d => {
  console.log(d.length > 0 ? d[0].url : "No issues found");
});
