const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const DOMParser = require("@xmldom/xmldom").DOMParser;
const xpath = require("xpath");
const iconv = require("iconv-lite");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/data", async (req, res) => {
  try {
    const { inn, street, name, brand, locnumber, emitent } = req.body;
    const buffer = await fs.readFile("./src/20050001.xml");
    const originalXml = iconv.decode(buffer, "windows-1251");
    const doc = new DOMParser().parseFromString(originalXml, "application/xml");

    const paramInn = xpath.select1("//parameter[@ID='105']", doc);
    if (paramInn) {
      const valueNode = paramInn.getElementsByTagName("value")[0];
      if (valueNode) {
        valueNode.textContent = inn.trim();
      }
    }

    const paramStreet = xpath.select1("//parameter[@ID='106']", doc);
    if (paramStreet) {
      const valueNode = paramStreet.getElementsByTagName("value")[0];
      if (valueNode) {
        valueNode.textContent = street.trim();
      }
    }

    const paramName = xpath.select1("//parameter[@ID='31340']", doc);
    if (paramName) {
      const valueNode = paramName.getElementsByTagName("value")[0];
      if (valueNode) {
        let spaceCount = Math.floor((24 - name.length) / 2);
        console.log(spaceCount);

        if (name.length >= 23) {
          valueNode.textContent = `${name.trim()}`;
        } else {
          let spacesBefore = Array(spaceCount + 1)
            .fill(" ")
            .join("");
          valueNode.textContent = spacesBefore + name.trim();
          console.log("условие соблюдено");
        }
      }
    }

    const paramBrand = xpath.select1("//parameter[@ID='31341']", doc);
    if (paramBrand) {
      const valueNode = paramBrand.getElementsByTagName("value")[0];
      if (valueNode) {
        valueNode.textContent = brand.trim();
      }
    }

    const updatedXml = doc.toString();

    const encodedXml = iconv.encode(updatedXml, "windows-1251");

    await fs.writeFile(`./output/${emitent}${locnumber}.xml`, encodedXml);

    res
      .status(200)
      .json({ message: "Данные успешно получены!", data: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка обработки данных.");
  }
});

app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
