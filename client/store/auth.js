import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(null)
    const user = ref(null)
    const login = (tok, usr) => {
      token.value = tok;
      user.value = usr;
      localStorage.setItem("token", tok);
      localStorage.setItem("user", JSON.stringify(usr));
    }
    const logout = () => {
      token.value = null;
      user.value = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return { token, user, login, logout };
});