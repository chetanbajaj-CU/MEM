(async () => {
  const res = await fetch("http://localhost:3000/api/generate-program", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "dumbbells only" })
  });
  console.log(await res.text());
})();
