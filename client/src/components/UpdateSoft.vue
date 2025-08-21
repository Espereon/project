<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
const formData = ref<FormData>({
  inn: "",
  street: "",
  name: "",
  brand: "",
  locnumber: "",
  emitent: "",
});
const responseMessage = ref("");

interface FormData {
  inn: string;
  street: string;
  name: string;
  brand: string;
  locnumber: string;
  emitent: string;
}

async function generationSoft() {
  try {
    if (!formData.value.locnumber || !formData.value.emitent) {
      responseMessage.value = "Не указан локальный номер или эмитент";
      return;
    }

    responseMessage.value = "Геренация ПО...";
    console.log("Отправляем запрос на генерацию:", formData.value);

    const response = await axios.post("/api/generationSoft", formData.value);
    console.log("Ответ сервера:", response.data);

    responseMessage.value = response.data.message;
  } catch (error: any) {
    console.error("Ошибка при генерации:", error);

    if (error.response) {
      console.log("Статус ошибки:", error.response.status);
      console.log("Данные ошибки:", error.response.data);
      responseMessage.value = `Ошибка: ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      console.log("Запрос отправлен, но ответа нет");
      responseMessage.value = "Ошибка сети: сервер не отвечает";
    } else {
      console.log("Ошибка настройки запроса:", error.message);
      responseMessage.value = `Ошибка: ${error.message}`;
    }
  }
}

async function sharedSoft() {
  try {
    if (!formData.value.locnumber || !formData.value.emitent) {
      responseMessage.value = "Не указан локальный номер или эмитент";
      return;
    }

    responseMessage.value = "Копирование файла...";
    console.log("Отправляем запрос на копирование:", formData.value);

    const response = await axios.post("/api/sharedSoft", formData.value);
    console.log("Ответ сервера:", response.data);

    responseMessage.value = response.data.message;
  } catch (error: any) {
    console.error("Ошибка при копировании:", error);

    if (error.response) {
      console.log("Статус ошибки:", error.response.status);
      console.log("Данные ошибки:", error.response.data);
      responseMessage.value = `Ошибка: ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      console.log("Запрос отправлен, но ответа нет");
      responseMessage.value = "Ошибка сети: сервер не отвечает";
    } else {
      console.log("Ошибка настройки запроса:", error.message);
      responseMessage.value = `Ошибка: ${error.message}`;
    }
  }
}
</script>
<template>
  <div>
    <div class="flex items-center gap-60">
      <div class="center">
        <form class="grid text-field">
          <div class="flex gap-10 justify-between">
            <label class="text-field__label" for="emitent"
              >Эмитент<input
                v-model="formData.emitent"
                class="text-field__input_innem"
                type="text"
                maxlength="4"
            /></label>
            <label class="text-field__label" for="locnumber"
              >Локальный номер<input
                v-model="formData.locnumber"
                class="text-field__input_innem"
                type="text"
                maxlength="4"
            /></label>
          </div>
          <br />
          <div class="flex gap-10 justify-center">
            <button
              class="btn-new"
              @click.prevent="generationSoft()"
              type="button"
            >
              Сгенерировать
            </button>
            <button class="btn-new" @click.prevent="sharedSoft()" type="button">
              Отправить на КС
            </button>
          </div>
          <br />
          <p>{{ responseMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.text-field {
  margin-bottom: 1rem;
}

.text-field__label {
  display: block;
  margin-bottom: 0.25rem;
}

.text-field__input {
  display: block;
  width: 500px;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.text-field__input_innem {
  display: block;
  width: 200px;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-new {
  width: 200px;
  height: 50px;
  border-radius: 10px;
  color: white;
  transition: 0.2s linear;
  background: #0b63f6;
}

.btn-new:hover {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #3c82f8;
}

.clear-btn {
  width: 150px;
  height: 40px;
  border-radius: 8px;
  color: white;
  transition: 0.2s linear;
  background: #dc2626;
  border: none;
  cursor: pointer;
}

.clear-btn:hover {
  background: #b91c1c;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #dc2626;
}

.container {
  font-family: "Courier New", Courier, monospace;
  font-size: 12px;
  line-height: 1.5;
  height: 250px;
  width: 230px;
  margin: 10px auto;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.container div {
  height: 20px;
}
</style>
