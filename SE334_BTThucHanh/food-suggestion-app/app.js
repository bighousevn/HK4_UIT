const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const app = express();

app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());
app.post("/suggest", (req, res) => {
  const ingredients = req.body.ingredients.map((i) => `'${i}'`).join(",");

  const query = `swipl -q -s recipes.pl -g "setof(R, suggest_recipe([${ingredients}], R), L), write(L)." -t halt`;

  exec(query, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Prolog error:", stderr);
      return res.status(500).send("Error: " + error.message);
    }

    const suggestions = stdout
      .replace(/[\[\]'\n\r]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    console.log(suggestions);
    res.send({ suggestions });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
