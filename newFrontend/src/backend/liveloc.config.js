import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export class Livelocservice {
  async sendLocation(data) {
    console.log("live here", data);
    // try {
    //   const res = await axios.post(`${server.serverUrl}/liveloc/location`);
    //   if (res) return res;
    //   else throw error;
    // } catch (error) {
    //   throw error;
    // }
  }
}
const livelocservice = new Livelocservice();
export default livelocservice;
