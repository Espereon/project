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

async function handleDataProcessing(req, res) {
  try {
    const { inn, street, name, brand, locnumber, emitent } = req.body;

    if (!inn || !street || !name || !brand || !locnumber || !emitent) {
      return res.status(400).json({ error: "Отсутствуют обязательные поля" });
    }

    const buffer = await fs.readFile("./src/20050001.xml");
    const originalXml = iconv.decode(buffer, "windows-1251");
    const doc = new DOMParser().parseFromString(originalXml, "application/xml");

    // Обновляем параметры XML-документа
    updateParameter(doc, "//parameter[@ID='105']", inn.trim()); // ИНН
    updateParameter(doc, "//parameter[@ID='106']", street.trim()); // Улица
    updateParameter(doc, "//parameter[@ID='31340']", formatName(name)); // Название
    updateParameter(doc, "//parameter[@ID='31341']", brand.trim()); // Бренд

    const updatedXml = doc.toString();
    const encodedXml = iconv.encode(updatedXml, "windows-1251");

    await fs.writeFile(`./output/${emitent}${locnumber}.xml`, encodedXml);

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

function formatName(name) {
  let formattedName = name.trim();
  if (formattedName.length <= 23) {
    const paddingSize = Math.floor((24 - formattedName.length) / 2);
    formattedName = " ".repeat(paddingSize) + formattedName;
  }
  return formattedName;
}

async function handleSharedRequest(req, res) {
  try {
    const { locnumber, emitent } = req.body;

    if (!locnumber || !emitent) {
      return res
        .status(400)
        .json({ error: "Отсутствует номер местоположения или эмитент" });
    }

    const sourceFile = `${emitent}${locnumber}.xml`;
    const sourceDirectory = "./output";
    const destinationDirectory = "./copied_files";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const destinationPath = path.join(destinationDirectory, sourceFile);

    // Проверяем наличие исходного файла
    try {
      await fs.access(sourcePath); // Проверяет доступ к файлу
      // Файл существует
    } catch (err) {
      if (err.code === "ENOENT") {
        // Файл не найден
        return res.status(404).json({ error: "Источник не найден" });
      }
      throw err; // Любые другие ошибки
    }

    // Создаем директорию назначения рекурсивно
    await fs.mkdir(destinationDirectory, { recursive: true });

    // Копируем файл
    await fs.copyFile(sourcePath, destinationPath);

    res.status(200).json({ message: "Файл успешно скопирован." });
  } catch (error) {
    console.error("Ошибка копирования файла:", error.message);
    res.status(500).json({ error: "Ошибка обработки данных." });
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

    const sourceFile = `${emitent}${locnumber}.xml`;
    const sourceDirectory = "./gazprom";
    const destinationDirectory = "./copied_files";
    const sourcePath = path.join(sourceDirectory, sourceFile);
    const destinationPath = path.join(destinationDirectory, sourceFile);

    // Проверяем наличие исходного файла

    await fs.access(sourcePath); // Проверяет доступ к файлу
    res.status(200).json({ message: "Файл найден" });
  } catch (err) {
    if (err.code === "ENOENT") {
      // Файл не найден
      return res.status(404).json({ error: "Источник не найден" });
    }
    throw err; // Любые другие ошибки
  }

  // Копируем файл
  //   await fs.copyFile(sourcePath, destinationPath);

  //   res.status(200).json({ message: "Файл успешно скопирован." });
  // } catch (error) {
  //   console.error("Ошибка копирования файла:", error.message);
  //   res.status(500).json({ error: "Ошибка обработки данных." });
  // }
}

app.post("/api/data", handleDataProcessing);
app.post("/api/shared", handleSharedRequest);
app.post("/api/sharedgazprom", handleSharedGazprom);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
