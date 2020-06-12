import Api from "./api";

class postManager {
  constructor() {
    this.Api = Api;

    let token = localStorage.getItem("@Auth:token");

    this.Api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  async teste() {
    const response = await this.Api.get("/teste");

    return response.data;
  }
}

export default postManager;
