const API_URL = "http://localhost:4000";
const axios = require("axios");

require("dotenv").config();

const REST_API_KEY = process.env.REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const GIT_REST_API_KEY = process.env.GIT_REST_API_KEY;
const GIT_REDIRECT_URI = process.env.GIT_REDIRECT_URI;
const GIT_SECRET_KEY = process.env.GIT_SECRET_KEY;

// 로그인 요청을 보내는 함수
async function postLogin(user_email, user_pw) {
  try {
    const { data: response } = await axios.post(
      `${API_URL}/users/login`,
      {
        user_email,
        user_pw,
      },
      {}
    );
    if (!response.success) {
      throw new Error("로그인에 실패했습니다.");
    }
    return response.token; // 로그인에 성공하면 백엔드로부터 토큰을 반환
  } catch (error) {
    throw error;
  }
}
async function getUsermodify(uid, userData) {
  try {
    const authorization = userData;
    const result = await axios.get(`${API_URL}/users/modify?=${uid}`, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });
    // console.log("wwwwwwwwwwwwwwUID", uid);
    // console.log("wwwwwwwwwwwwwwDAta", userData);
    // console.log("wwwwwwwwwwwwwwresult.data", result);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`SERVICE putUsermodify ERROR: ${error.message}`);
  }
}

async function postUsermodify(uid, userData, token) {
  try {
    const authorization = token;

    const result = await axios.post(`${API_URL}/users/${uid}`, userData, {
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
    });
    console.log("wwwwwwwwwwwwwwUID", uid);

    return result;
  } catch (error) {
    throw new Error(`SERVICE putUsermodify ERROR: ${error.message}`);
  }
}

async function postSignup(userData) {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.token;
  } catch (error) {
    throw error;
  }
}

async function kakaoLogin(code) {
  try {
    const host = "https://kauth.kakao.com/oauth/token";
    const body = `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}`;
    const respones = await axios.post(host, body, {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    });
    // console.log(respones);
    const {
      data: { access_token },
    } = respones;
    // console.log(access_token);

    const userinfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
    });
    // console.log(userinfo);

    const {
      data: { id },
    } = userinfo;
    const { nickname } = userinfo.data.properties;
    const { email } = userinfo.data.kakao_account;

    // console.log(id, email, nickname);
    const token = await axios.post(`${API_URL}/users/kakao`, {
      id,
      nickname,
      email,
      provider: "kakao",
    });
    // console.log(token);
    return token;
  } catch (error) {
    throw error;
  }
}

async function gitLogin(code) {
  try {
    const host = "https://github.com/login/oauth/access_token";
    const body = {
      client_id: GIT_REST_API_KEY,
      client_secret: GIT_SECRET_KEY,
      code,
    };
    const { data } = await axios.post(host, body);

    const access_token = data.split("access_token=")[1].split("&")[0];

    const { data: userInfo } = await axios.get("https://api.github.com/user", {
      headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, login, name: nickname, email } = userInfo;

    const token = await axios.post(`${API_URL}/users/git`, {
      id,
      nickname,
      email,
      provider: "git",
    });
    return token;
  } catch (e) {
    throw new Error("userService gitLogin err", e.message);
  }
}
async function getUserInfo(token) {
  try {
    const response = await axios.get(`${API_URL}/users/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // if (userInfo.admin === 1) {
    //   console.log("response...............................", response.data, user);
    //   return response.data;
    // } else if (userInfo.admin === 0) {
    //   return response.data;
    // }

    // 서버로부터 받은 사용자 정보를 반환
  } catch (error) {
    throw error;
  }
}

async function getLogout(uid) {
  try {
    const response = await axios.get(`${API_URL}/users/logout/${uid}`, {
      withCredentials: true, // 쿠키를 전송하기 위한 옵션
    });

    console.log(`로그아웃---->`, response);
    // if (response.status === 201) {
    //     document.cookie =
    //         "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //     console.log("쿠키 클리어 성공");
    // } else {
    //     console.error("쿠키 클리어 실패");
    // }
    // document.cookie =
    //     "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return response;
  } catch (error) {
    throw error;
  }
}

async function admin() {
  try {
    const response = await axios.get(`${API_URL}/admin/admin`, {});

    console.log(`admin내나---->`, response);

    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  postLogin,
  postSignup,
  kakaoLogin,
  gitLogin,
  getUserInfo,
  getUsermodify,
  postUsermodify,
  getLogout,
  admin,
};
