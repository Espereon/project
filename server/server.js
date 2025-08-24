const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const DOMParser = require("@xmldom/xmldom").DOMParser;
const xpath = require("xpath");
const iconv = require("iconv-lite");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Функция для форматирования локального номера с ведущими нулями
function formatLocNumber(locnumber) {
  return locnumber.toString().padStart(4, "0");
}

async function handleXmlEdit(req, res) {
  try {
    const { inn, street, name, brand, locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res.status(400).json({
        error: "Отсутствуют обязательные поля (локальный номер или эмитент)",
      });
    }

    const buffer = await fs.readFile("./src/20050001.xml");
    const originalXml = iconv.decode(buffer, "windows-1251");
    const doc = new DOMParser().parseFromString(originalXml, "application/xml");
    const formattedName = formatParams(name);
    const formattedBrand = formatParams(brand);
    const formattedLocNumber = formatLocNumber(locnumber);

    updateParameter(doc, "//parameter[@ID='105']", inn.trim());
    updateParameter(
      doc,
      "//parameter[@ID='106']",
      street.trim().replace(/ё/g, "е")
    );
    updateParameter(doc, "//parameter[@ID='31340']", formattedName);
    updateParameter(doc, "//parameter[@ID='31341']", formattedBrand);

    const updatedXml = doc.toString();
    const encodedXml = iconv.encode(updatedXml, "windows-1251");

    await fs.writeFile(
      `./output/${emitent}${formattedLocNumber}.xml`,
      encodedXml
    );

    res
      .status(200)
      .json({ message: "Данные успешно обновлены.", data: req.body });
  } catch (error) {
    console.error("Ошибка обработки данных:", error.message);
    res.status(500).json({ error: "Ошибка обработки данных." });
  }
}

function updateParameter(doc, selector, value) {
  const parameter = xpath.select1(selector, doc);
  if (parameter && parameter.getElementsByTagName("value")[0]) {
    parameter.getElementsByTagName("value")[0].textContent = value;
  }
}

function formatParams(param) {
  let formattedName = param.trim().replace(/ё/g, "е");
  if (formattedName.length <= 23) {
    const paddingSize = Math.floor((24 - formattedName.length) / 2);
    formattedName = " ".repeat(paddingSize) + formattedName;
  }
  return formattedName;
}

async function handleXmlShared(req, res) {
  try {
    const { locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res
        .status(400)
        .json({ error: "Отсутствует локальный номер или эмитент" });
    }

    const formattedLocNumber = formatLocNumber(locnumber);
    const sourceFile = `${emitent}${formattedLocNumber}.xml`;
    const sourceDirectory = "./output";
    const destinationDirectory = "./cs";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const destinationPath = path.join(destinationDirectory, sourceFile);

    try {
      await fs.access(sourcePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "Источник не найден" });
      }
      throw err;
    }
    await fs.copyFile(sourcePath, destinationPath);
    res.status(200).json({ message: "Файл успешно скопирован." });
  } catch (error) {
    console.error("Ошибка копирования файла:", error.message);
    res.status(500).json({ error: "Ошибка при копировании файла." });
  }
}

async function handleSearchGazprom(req, res) {
  try {
    const { locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res
        .status(400)
        .json({ error: "Отсутствует локальный номер или эмитент" });
    }

    const formattedLocNumber = formatLocNumber(locnumber);
    const sourceFile = `${emitent}${formattedLocNumber}.xml`;
    const sourceDirectory = "./gazprom";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const buffer = await fs.readFile(sourcePath);
    const originalXml = iconv.decode(buffer, "windows-1251");
    const doc = new DOMParser().parseFromString(originalXml, "application/xml");
    function extractParameter(doc, selector) {
      const parameter = xpath.select1(selector, doc);
      if (parameter && parameter.getElementsByTagName("value")[0]) {
        return parameter.getElementsByTagName("value")[0].textContent.trim();
      }
      return "";
    }
    const inn = extractParameter(doc, "//parameter[@ID='105']");
    const street = extractParameter(doc, "//parameter[@ID='106']");
    const name = extractParameter(doc, "//parameter[@ID='31340']");
    const brand = extractParameter(doc, "//parameter[@ID='31341']");
    res.status(200).json({
      message: "Конфиг найден, данные извлечены",
      data: {
        inn: inn,
        street: street,
        name: name,
        brand: brand,
        locnumber: locnumber,
        emitent: emitent,
      },
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ error: "Источник не найден" });
    }
    console.error("Ошибка поиска файла:", error.message);
    res.status(500).json({ error: "Конфиг не найден" });
  }
}

async function handleSharedGazprom(req, res) {
  try {
    const { locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res
        .status(400)
        .json({ error: "Отсутствует локальный номер или эмитент" });
    }

    const formattedLocNumber = formatLocNumber(locnumber);
    const sourceFile = `${emitent}${formattedLocNumber}.xml`;
    const sourceDirectory = "./gazprom";
    const destinationDirectory = "./cs";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const destinationPath = path.join(destinationDirectory, sourceFile);

    try {
      await fs.access(sourcePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "Источник не найден" });
      }
      throw err;
    }
    await fs.copyFile(sourcePath, destinationPath);

    res.status(200).json({ message: "Конфиг успешно скопирован." });
  } catch (error) {
    console.error("Ошибка копирования файла:", error.message);
    res.status(500).json({ error: "Ошибка обработки данных." });
  }
}

async function handleGenerationSoft(req, res) {
  try {
    const { locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res
        .status(400)
        .json({ error: "Отсутствует локальный номер или эмитент" });
    }
    const formattedLocNumber = formatLocNumber(locnumber);
    const sourceFile = "soft.xml";
    const sourceFolder = "./soft";
    const sourceDirectory = "./src";
    const destinationDirectory = "./output_soft";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const sourcePathFolder = path.join(sourceDirectory, sourceFolder);
    const destinationPathXml = path.join(
      destinationDirectory,
      `${emitent}${formattedLocNumber}s.xml`
    );
    const destinationPathFolder = path.join(
      destinationDirectory,
      `${emitent}${formattedLocNumber}s`
    );
    try {
      await fs.access(sourcePath);
      await fs.access(sourcePathFolder);
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "Источник не найден" });
      }
      throw err;
    }
    await fs.copyFile(sourcePath, destinationPathXml);
    await fs.cp(sourcePathFolder, destinationPathFolder, { recursive: true });
    res.status(200).json({ message: "ПО успешно сгенерировано" });
  } catch (error) {
    console.error("Ошибка обработки данных:", error.message);
    res.status(500).json({ error: "Ошибка генерации ПО" });
  }
}

async function handleSharedSoft(req, res) {
  try {
    const { locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res
        .status(400)
        .json({ error: "Отсутствует локальный номер или эмитент" });
    }
    const formattedLocNumber = formatLocNumber(locnumber);
    const sourceFile = `${emitent}${formattedLocNumber}s.xml`;
    const sourceFolder = `${emitent}${formattedLocNumber}s`;
    const sourceDirectory = "./output_soft";
    const destinationDirectory = "./cs";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const sourcePathFolder = path.join(sourceDirectory, sourceFolder);
    const destinationPathXml = path.join(destinationDirectory, sourceFile);
    const destinationPathFolder = path.join(destinationDirectory, sourceFolder);

    try {
      await fs.access(sourcePath);
      await fs.access(sourcePathFolder);
    } catch (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "Источник не найден" });
      }
      throw err;
    }
    await fs.copyFile(sourcePath, destinationPathXml);

    await fs.cp(sourcePathFolder, destinationPathFolder, { recursive: true });
    res.status(200).json({ message: "Файл и папка успешно скопированы на КС" });
  } catch (error) {
    console.error("Ошибка копирования файла:", error.message);
    res.status(500).json({ error: "Ошибка обработки данных." });
  }
}

app.post("/api/data", handleXmlEdit);
app.post("/api/shared", handleXmlShared);
app.post("/api/searchgazprom", handleSearchGazprom);
app.post("/api/sharedgazprom", handleSharedGazprom);
app.post("/api/generationSoft", handleGenerationSoft);
app.post("/api/sharedSoft", handleSharedSoft);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
