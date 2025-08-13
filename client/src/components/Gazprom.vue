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
</script>

<template>
  <div>
    <div>
      <router-link to="/">Go to edit</router-link>
      <form>
        <div>
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
        <div>
          <button>Поиск</button>
          <button>Отправить на КС</button>
        </div>
      </form>
    </div>
    <div>
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
  </div>
</template>

<style scroped>
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
