// Импортируем библиотеки
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const DOMParser = require("@xmldom/xmldom").DOMParser;
const xpath = require("xpath");
const iconv = require("iconv-lite");

// Создаем экземпляр приложения
const app = express();
const PORT = 3001;

// Разрешаем CORS для всех доменов (для разработки)
app.use(cors());
// Позволяем Express обрабатывать JSON в теле запроса
app.use(express.json());

// Маршрут для приема данных
app.post("/api/data", async (req, res) => {
  try {
    // Извлекаем данные напрямую из тела запроса
    const { inn, street, name, brand } = req.body;

    // Читаем оригинальный XML-файл
    const buffer = await fs.readFile("./src/20050001.xml");
    const originalXml = iconv.decode(buffer, "windows-1251");

    // Парсим XML-документ
    const doc = new DOMParser().parseFromString(originalXml, "application/xml");

    // Обновляем значение ИНН
    const paramInn = xpath.select1("//parameter[@ID='105']", doc);
    if (paramInn) {
      const valueNode = paramInn.getElementsByTagName("value")[0]; // Выбираем элемент <value>
      if (valueNode) {
        valueNode.textContent = inn.trim(); // Устанавливаем новое значение в <value>
      }
    }

    // Обновляем улицу
    const paramStreet = xpath.select1("//parameter[@ID='106']", doc);
    if (paramStreet) {
      const valueNode = paramStreet.getElementsByTagName("value")[0]; // Выбираем элемент <value>
      if (valueNode) {
        valueNode.textContent = street.trim(); // Устанавливаем новое значение в <value>
      }
    }

    // Обновляем имя
    const paramName = xpath.select1("//parameter[@ID='31340']", doc);
    if (paramName) {
      const valueNode = paramName.getElementsByTagName("value")[0]; // Выбираем элемент <value>
      if (valueNode) {
        valueNode.textContent = name.trim(); // Устанавливаем новое значение в <value>
      }
    }

    // Обновляем бренд
    const paramBrand = xpath.select1("//parameter[@ID='31341']", doc);
    if (paramBrand) {
      const valueNode = paramBrand.getElementsByTagName("value")[0]; // Выбираем элемент <value>
      if (valueNode) {
        valueNode.textContent = brand.trim(); // Устанавливаем новое значение в <value>
      }
    }

    // Конвертируем обновленный XML в строку
    const updatedXml = doc.toString();

    // Кодируем в исходную кодировку
    const encodedXml = iconv.encode(updatedXml, "windows-1251");

    // Сохраняем изменённый XML в новую папку
    await fs.mkdir("./output", { recursive: true });
    await fs.writeFile("./output/new_sample.xml", encodedXml);

    // Ответ пользователю
    res
      .status(200)
      .json({ message: "Данные успешно получены!", data: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка обработки данных.");
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
