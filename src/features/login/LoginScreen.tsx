import * as React from "react";
import "./LoginScreen.css";
import axios from "axios";
import { URL_GET_TOKEN, publicKey } from "../../helper/base";
import { useHistory } from "react-router-dom";

const LoginScreen = () => {
  const [userName, setUserName] = React.useState("");
  const [passWord, setPassWord] = React.useState("");

  const history = useHistory();

  // logo
  const HyperLogo = require("../../assets/hyper-logo.png").default;

  // ----------------- login --------------------------

  const onLogin = () => {
    console.log("GET TOKEN: ", userName + "---" + passWord);
    if (validate(userName, passWord)) {
      getToken();
    }
  };
  // ---------------- validate form -----------------------

  const validate = (userName: string, password: string) => {
    if (userName.length == 0 || password.length == 0) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return false;
    } else {
      console.log("Login Success ........");
      return true;
    }
  };

  // ---------------- get token -------------------------
  const getToken = async () => {
    console.log("test_get_token: ", URL_GET_TOKEN);

    // Platform.OS === 'android' &&  ToastAndroid.show("get_api: "+ URL_GET_TOKEN, ToastAndroid.SHORT);

    await axios
      .get(URL_GET_TOKEN, {
        params: {
          publicKey: publicKey,
        },
      })
      .then((response) => {
        // Platform.OS === 'android' &&  ToastAndroid.show("get_api_success: "+ response, ToastAndroid.SHORT);

        console.log("test_login_rs_0: ", response);
        const rs = response?.data;
        if (rs?.Code === 200) {
          const token = rs?.Token;
          console.log("Token_LoginScreen: ", token);
          localStorage.setItem("Token", token);
          history.push("/upload-identity-card");
        } else {
        }
      })
      .catch((error) => {
        // Platform.OS === 'android' &&  ToastAndroid.show("get_api_fail: "+ error, ToastAndroid.SHORT);
        console.log("VerifyLogin: " + error);
      });
  };
  return (
    <div className="login_container">
      <img src={HyperLogo} className="login_logo" />
      <div className="login_form">
        <span className="login_title">Nhập Thông Tin</span>
        <span className="imput_field_label">Tên đăng nhập</span>
        <input
          className="input_field"
          placeholder="vui lòng nhập tên đăng nhập"
          onChange={(event) => setUserName(event.target.value)}
        ></input>
        <span className="imput_field_label">Mật Khẩu</span>
        <input
          className="input_field"
          placeholder="vui lòng nhập mật khẩu"
          onChange={(event) => setPassWord(event.target.value)}
          type="password"
        ></input>
        <button className="login_btn" onClick={onLogin}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
