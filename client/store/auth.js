import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(null)
    const user = ref(null)
    const login = (token, user) => {
      this.token = token;
      this.user = user;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }
    const logout = () => {
      this.token = null;
      this.user = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
    return { token, user, login, logout };
});