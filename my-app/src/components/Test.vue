<template>
  <p>Users data</p>
  <p>{{ data }}</p>

  <p>Create new user</p>
  <form @submit.prevent="doSomething">
    <div><input v-model="name" /></div>
    <div><input v-model="email" /></div>

    <button>Submit</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useQuery } from "vue-query";

const email = ref("");
const name = ref("");

const doSomething = () => {};

const { data } = useQuery("users", () =>
  fetch("http://localhost:3000/api/users").then((res) => res.json())
);
</script>
