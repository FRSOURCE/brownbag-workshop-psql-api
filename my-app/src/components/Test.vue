<template>
  <p>Users data: </p>
  <p>{{ data }}</p>
  <div v-if="isError">
    Something went wrong: {{error.message}}
  </div>

  <br>
  <p>Create new user: </p>
  <form @submit.prevent="addUser">
    <div><label>Name <input v-model="name" /></label></div>
    <div><label>email <input v-model="email" /></label></div>
    <br>
    <button>Submit</button>
  </form>
  <div v-if="isSuccess">
    User {{ addedUser }} successfully added.
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useQuery, useMutation } from "vue-query";

const email = ref("");
const name = ref("");
const addedUser = ref("")

const useAddUserMutation = () => {
  return useMutation((newUser) => fetch("http://localhost:3000/api/users", { method: "POST", body: JSON.stringify(newUser), headers: {
        "Content-type": "application/json; charset=UTF-8"
  }}),{
    onSuccess: (data, variables) => {
      addedUser.value = variables.name
    }
  });
}

const { isError, error, isSuccess, mutate } = useAddUserMutation();

const addUser = () => {
  mutate({email: email.value, name: name.value});
};

const { data } = useQuery("users", () =>
  fetch("http://localhost:3000/api/users").then((res) => res.json())
);
</script>
