import { retry } from "@reduxjs/toolkit/query";
import server from "../conf/conf.js";
import axios from "axios";
axios.defaults.withCredentials = true;

export class Authservice {
  async register(data) {
    try {
      console.log(data);
      const response = await axios.post(
        `${server.serverUrl}/users/register`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let axios set the correct content-type
          },
        }
      );
      if (response) {
        return response;
      } else throw error;
    } catch (error) {
      throw error;
    }
  }

  async login(data) {
    try {
      const response = await axios.post(
        `${server.serverUrl}/users/login`,
        data,
        {
          withCredentials: true,
        }
      );
      if (response) return response;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(
        `${server.serverUrl}/users/current/current-user`
      );
      if (response.status == 200) {
        const {
          _id,
          userName,
          email,
          fullName,
          avatar,
          refreshToken,
          linkedin,
          googleScholar,
          designation,
        } = response.data.data;
        return {
          _id,
          userName,
          email,
          fullName,
          avatar,
          refreshToken,
          linkedin,
          googleScholar,
          designation,
        };
      } else throw error;
    } catch (err) {
      throw err;
    }
  }

  async logout() {
    try {
      const res = await axios.post(`${server.serverUrl}/users/logout`);
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      console.error(error.message);
    }
  }

  async refreshTokens() {
    try {
      const res = await axios.post(`${server.serverUrl}/users/refresh-tokens`, {
        withCredentials: true,
      });
      if (res.status == 200) return res;
      else throw error;
    } catch (error) {
      console.error(error.message);
    }
  }

  async checkRefresh() {
    try {
      const res = await axios.get(`${server.serverUrl}/users/check-refresh`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }

  async getUser(userName) {
    try {
      const res = await axios.get(`${server.serverUrl}/users/${userName}`);
      if (res) return res;
      else throw error;
    } catch (error) {
      throw error;
    }
  }
}
const authservice = new Authservice();
export default authservice;