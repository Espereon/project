<script setup>
import { ref } from "vue";
import axios from "axios";

const formData = ref({
  inn: "",
  street: "",
  name: "",
  brand: "",
});
const responseMessage = ref("");

async function submitData() {
  try {
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
      <input id="inn" v-model="formData.inn" /><br />
      <label for="street">Улица:</label><br />
      <input id="street" v-model="formData.street" /><br />
      <label for="name">Имя:</label><br />
      <input id="name" v-model="formData.name" /><br />
      <label for="brand">Брэнд:</label><br />
      <input id="brand" v-model="formData.brand" /><br />
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
