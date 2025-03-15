require("dotenv").config();

const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUBSPOT_BASE_URL = "https://api.hubapi.com/crm/v3/objects/pets";

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
};

// Homepage Route
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `${HUBSPOT_BASE_URL}?properties=name,favorite_toy,species`,
      { headers }
    );
    const customObjects = response.data.results;
    res.render("homepage", { title: "Homepage", customObjects });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error retrieving data");
  }
});

// Render Update Custom Object Form
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// Handle Form Submission & Create CRM Record
app.post("/update-cobj", async (req, res) => {
  const { property1, property2, property3 } = req.body;
  try {
    await axios.post(
      HUBSPOT_BASE_URL,
      {
        properties: {
          name: property1.trim(),
          favorite_toy: property2.trim(),
          species: property3,
        },
      },
      { headers }
    );
    res.redirect("/");
  } catch (error) {
    console.error("Error creating CRM record:", error);
    res.status(500).send("Error creating CRM record");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
