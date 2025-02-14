/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class GuardService {
  async ListGuard() {
    try {
      const res = await axios.get(`${server.serverUrl}/guard/list`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
  async ListUnassignedGuard() {
    try {
      const res = await axios.get(
        `${server.serverUrl}/guard/unassignedGuardsList`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async ListAssignedGuards() {
    try {
      const res = await axios.get(`${server.serverUrl}/guard/assignedGuards`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}

const guardService = new GuardService();
export default guardService;
