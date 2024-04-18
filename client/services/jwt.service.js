export const getToken = async () => {
    try {
      if (process.client) {
        const saved_token = localStorage.getItem("token");
        if (saved_token){
        return true
        }
      }
    } catch (err) {
      console.log(err.message)
      return {message: err.message}
    }
  }