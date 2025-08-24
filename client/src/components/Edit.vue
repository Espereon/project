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

const validateINN = (inn: string) => /^\d+$/.test(inn);
const validateEmitent = (emitent: string) =>
  ["2005", "2021", "3100", "3101", "3102", "2013"].includes(emitent);

async function submitData() {
  try {
    if (
      !validateINN(formData.value.inn) ||
      !validateEmitent(formData.value.emitent)
    ) {
      responseMessage.value = "Данные введены некорректно!";
      return;
    }

    const response = await axios.post("/api/data", formData.value);
    responseMessage.value = response.data.message;
  } catch (error: any) {
    if (error.response) {
      responseMessage.value = `Ошибка сервера: ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      responseMessage.value =
        "Сервер не отвечает. Проверьте, запущен ли сервер на порту 3001";
    } else {
      responseMessage.value = `Ошибка: ${error.message}`;
    }
  }
}

async function sharedXml() {
  try {
    if (!formData.value.locnumber || !formData.value.emitent) {
      responseMessage.value = "Не указан локальный номер или эмитент";
      return;
    }
    const response = await axios.post("/api/shared", formData.value);
    responseMessage.value = response.data.message;
  } catch (error: any) {
    console.error("Error sending data:", error);

    if (error.response) {
      responseMessage.value = `Ошибка сервера: ${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      responseMessage.value =
        "Сервер не отвечает. Проверьте, запущен ли сервер на порту 3001";
    } else {
      responseMessage.value = `Ошибка: ${error.message}`;
    }
  }
}
</script>

<template>
  <div class="flex items-center gap-60">
    <div class="center pt-10">
      <form class="grid text-field" @submit.prevent="submitData">
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
        <label class="text-field__label" for="inn">ИНН:</label><br />
        <input
          class="text-field__input"
          id="inn"
          v-model="formData.inn"
          type="text"
          pattern="\d+"
          maxlength="24"
        /><br />
        <label class="text-field__label" for="street">Улица:</label><br />
        <input
          class="text-field__input"
          id="street"
          v-model="formData.street"
          type="text"
          maxlength="24"
        /><br />
        <label class="text-field__label" for="name">Имя:</label><br />
        <input
          class="text-field__input"
          id="name"
          v-model="formData.name"
          type="text"
          maxlength="24"
        />
        <br />
        <label class="text-field__label" for="brand">Брэнд:</label><br />
        <input
          class="text-field__input"
          id="brand"
          v-model="formData.brand"
          type="text"
          maxlength="24"
        /><br />
        <div class="flex gap-10 justify-center">
          <button class="btn-new" type="submit">Сгенерировать</button>
          <button @click="sharedXml()" class="btn-new" type="button">
            Отправить на КС
          </button>
        </div>
      </form>

      <p>{{ responseMessage }}</p>
    </div>
    <div class="container flex flex-col gap-2">
      <div>ОТЧЕТ ЗА СМЕНУ</div>
      <div>{{ formData.name }}</div>
      <div>ИНН {{ formData.inn }}</div>
      <div>{{ formData.street }}</div>
      <div>{{ formData.brand }}</div>
      <div>НАЧАЛО 30/03/03 9:00:01</div>
      <div>ОКОНЧА 30/03/03 17:00:59</div>
      <div class="flex items-center justify-between">
        <div>Терминал</div>
        <div>№ {{ formData.locnumber }}</div>
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
  display: inline-block;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #0b63f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 180px;
  text-align: center;
}

.btn-new:hover {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #3c82f8;
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
