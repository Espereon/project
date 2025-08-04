<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

interface FormData {
  inn: string;
  street: string;
  name: string;
  brand: string;
}

const validateFieldLength = (field: string, maxLength: number) =>
  field.length <= maxLength;

const validateINN = (inn: string) => /^\d+$/.test(inn);

const formData = ref<FormData>({
  inn: "",
  street: "",
  name: "",
  brand: "",
});
const responseMessage = ref("");

async function submitData() {
  try {
    if (
      !validateFieldLength(formData.value.street, 24) ||
      !validateFieldLength(formData.value.name, 24) ||
      !validateFieldLength(formData.value.brand, 24) ||
      !validateINN(formData.value.inn)
    ) {
      responseMessage.value = "Данные введены некорректно!";
      return;
    }
    const response = await axios.post("/api/data", formData.value);
    responseMessage.value = response.data.message;
    console.log("Server response:", response.data);
  } catch (error) {
    responseMessage.value = "Error sending data.";
    console.error("Error sending data:", error);
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="submitData">
      <label for="inn">ИНН:</label><br />
      <input
        id="inn"
        v-model="formData.inn"
        type="text"
        pattern="\d+"
        maxlength="24"
      /><br />
      <label for="street">Улица:</label><br />
      <input
        id="street"
        v-model="formData.street"
        type="text"
        maxlength="24"
      /><br />
      <label for="name">Имя:</label><br />
      <input
        id="name"
        v-model="formData.name"
        type="text"
        maxlength="24"
      /><br />
      <label for="brand">Брэнд:</label><br />
      <input
        id="brand"
        v-model="formData.brand"
        type="text"
        maxlength="24"
      /><br />
      <button type="submit">Отправить</button>
    </form>
    <p>{{ responseMessage }}</p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
