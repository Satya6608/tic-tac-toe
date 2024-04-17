import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(null)
    const user = ref(null)
    const login = (tok, usr) => {
      token.value = tok;
      user.value = usr;
      sessionStorage.setItem("token", tok);
      sessionStorage.setItem("user", JSON.stringify(usr));
    }
    const logout = () => {
      token.value = null;
      user.value = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
    return { token, user, login, logout };
});