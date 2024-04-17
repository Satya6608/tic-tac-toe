
import { getToken } from "~/services/jwt.service";

export default defineNuxtRouteMiddleware(async (to,from) => {
  if (process.client){
    const user = await getToken()
    if(!user) 
      return navigateTo("/")
  }
})