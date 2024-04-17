export const getToken = async () => {
    try {
      if (process.client) {
        const saved_token = sessionStorage.getItem("token");
        if (saved_token){
        return true
        }
      }
    } catch (err) {
      console.log('getTempToken - error')
      console.log(err.message)
      return {message: err.message}
    }
  }