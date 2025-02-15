import { Class } from "leaflet";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export class OtherServices {
  async getratings() {
    try {
      const res = await axios.get(`${server.serverUrl}/guard/getrating`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}
const otherServices = new OtherServices();
export default otherServices;
