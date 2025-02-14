/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export class AdminService {
  async getUnauthorisedGuards() {
    try {
      const res = await axios.get(`${server.serverUrl}/admin/unauthorised`);
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async approveRejectGuards(id, isApproved) {
    try {
      if (isApproved) {
        const res = await axios.patch(
          `${server.serverUrl}/admin/authorise/${id}`
        );
        if (res.status == 200) return res;
        else throw error;
      } else {
        const res = await axios.patch(`${server.serverUrl}/admin/reject/${id}`);
        if (res.status == 200) return res;
        else throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
const adminservice = new AdminService();
export default adminservice;
