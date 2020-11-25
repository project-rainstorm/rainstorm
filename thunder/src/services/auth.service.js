export default class AuthService {
  /**
   * Takes in credentials and makes a request to authenticate the user
   * Stores the access and refresh tokens inside local storage for later retrieval
   * @param password
   * @returns {Promise<any>}
   */
  static login(password) {
    return fetch("/login", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token && data.refresh_token) {
          localStorage.setItem("user", JSON.stringify(data));
        }
        return data;
      });
  }

  /**
   * Requests a new access token by using the user's refresh token
   * returns a boolean indication if successful
   * @returns {Promise<any>|Promise<boolean>}
   */
  static refreshAccessToken() {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.refresh_token) {
      return new Promise((res) => res(false));
    }

    return fetch("/refresh", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userData.refresh_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...userData, access_token: data.access_token })
          );
          return true;
        }
        return false;
      });
  }

  /**
   * Delete tokens from storage
   */
  static logout() {
    localStorage.removeItem("user");
  }

  /**
   * Obtain stored user information and tokens from local storage
   * @returns {any}
   */
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}
