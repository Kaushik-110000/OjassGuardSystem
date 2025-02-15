/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export class LocationService {
  async getLocationCoordinates(location) {
    try {
      const res = await axios.post(
        `${server.serverUrl}/location/getCoordinates`,
        location
      );
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async addAssignment(data) {
    try {
      const res = await axios.post(`${server.serverUrl}/location/assign`, data);
      if (res.status == 201) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async removeAssignment({ assignmentId }) {
    try {
      console.log("ASID", assignmentId);
      const res = await axios.post(
        `${server.serverUrl}/location/unassignTheGuard/${assignmentId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
  
  async getSingleAssignment(assignmentId) {
    try {
      const res = await axios.get(
        `${server.serverUrl}/location/getAssignment/${assignmentId}`
      );
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}
const locationservice = new LocationService();
export default locationservice;
