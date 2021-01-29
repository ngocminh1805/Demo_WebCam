import axios from "axios";
import * as React from "react";
import { URL_OCR } from "../../helper/base";
import InputFileCustom from "./components/inputfile-custom";
import { useHistory } from "react-router-dom";
import "./Upload-Identity_Card_Screen.css";
import { userInfo } from "os";

const UploadIdentityCardScreen = () => {
  const [IdentityCard, setIdentityCard] = React.useState([]);
  const [frontFile, setFrontFile] = React.useState(null);
  const [backFile, setBackFile] = React.useState(null);
  const [type, setType] = React.useState(0);
  const [loadingOcr, setLoadingOcr] = React.useState(false);

  const history = useHistory();
  // -------------- load image -------------------------------
  //@ts-ignore
  const loadFile = (e, type: number) => {
    if (type == 0) {
      var front_image = document.getElementById("front-image");
      //@ts-ignore
      front_image.src = URL.createObjectURL(e.target.files[0]);
    } else {
      var back_image = document.getElementById("back-image");
      //@ts-ignore
      back_image.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  // ------------------- ocr -----------------------------------

  const ocr = async () => {
    if (frontFile == null || backFile == null) {
      alert("Hãy nhập đủ thông tin ảnh");
    } else {
      setLoadingOcr(true);
      const token = localStorage.getItem("Token");

      var formData = new FormData();

      formData.append(
        "IdCardFront",
        //@ts-ignore
        frontFile,
        `FrontIdCard_${new Date().getTime()}.jpg`
      );

      formData.append(
        "IdCardBack",
        //@ts-ignore
        backFile,
        `BackIdCard_${new Date().getTime()}.jpg`
      );

      const config = {
        headers: {
          // "Content-Type": "application/json",
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token || ""}`,
        },
      };

      console.log("FORM DATA : ", formData);

      await axios
        .post(URL_OCR, formData, config)
        .then((response) => {
          // Platform.OS === 'android' && ToastAndroid.show("get_ocr_success: ", ToastAndroid.SHORT);
          const code = response?.data?.code;
          const data = response?.data?.data;
          const card = data?.idCard;
          const urlXml = data?.urlXml;

          // if (CURRENT_APP === TYPE_APPS.VIETTEL_EXIMBANK) {
          //   const cif = data?.cif;
          //   if (cif !== '' && cif !== null) {
          //     Alert.alert('Mã CIF đã tồn tại: ', cif);
          //   }
          // }

          console.log("RESPONSE: ", response);
          console.log(
            "test_extractInformation_3: ",
            response?.data?.data,
            "__",
            data.guidID,
            "__xml: ",
            urlXml
          );
          if (
            (card?.msgDataFront != "" && card?.msgDataFront != null) ||
            (card?.msgDataBack != "" && card?.msgDataBack != null)
          ) {
            setLoadingOcr(false);
            // this.setState({
            //   extractBtnStatus: false,
            //   isDoneOCR: true,
            //   matchedSuccess: code === 400 ? false : true,
            //   msgOCR:
            //     (card?.msgDataFront != '' && card?.msgDataFront != null
            //       ? card?.msgDataFront
            //       : '') +
            //     (card?.msgDataBack != '' && card?.msgDataBack != null
            //       ? card?.msgDataBack
            //       : ''),
            // });
          } else {
            // globalConfiguration.AppUserName = response.data.idCard.identCardName;
            const UserInfo = {
              cardType: card?.identCardType || "",
              id: card?.identCardNumber || "",
              fullName: card?.identCardName || "",
              dateOfBirth: card?.identCardBirthDate || "",
              guiId: data.guidID,
              gender: card?.identCardGender,
              nation_ethnic: card?.identCardNation || "",
              hometown: card?.identCardCountry || "",
              addressResidence: card?.identCardAdrResidence || "",
              expireDate: card?.identCardExpireDate || "",
              identCardIssueDate: card?.identCardIssueDate || "",
              // base64Image: data.resultStatus?.returnObj || '',
            };

            console.log("====================================");
            console.log("USER INFO :", UserInfo);
            console.log("====================================");

            localStorage.setItem("UserInfo_guiId", UserInfo.guiId);

            setLoadingOcr(false);
            // console.log('test_base_64: ', data.resultStatus?.returnObj)

            // this.setState({
            //   fetchData: true,
            //   extractBtnStatus: false,
            //   isFrontDisplayCollapsed: true,
            //   isBackDisplayCollapsed: true,
            //   isDoneOCR: true,
            //   matchedSuccess: code === 400 ? false : true,
            //   msgOCR: 'OCR thành công.',
            // });

            history.push("/capture-video", {
              userinfo: UserInfo,
              frontFile: frontFile,
              backFile: backFile,
              guiId:UserInfo.guiId
            });
          }
          // })
        })
        .catch((error) => {
          // Platform.OS === 'android' && ToastAndroid.show("get_ocr_fail: " + error, ToastAndroid.SHORT);
          console.log("test_extractInformation_2: ", error);
          // this.setState({
          //   extractBtnStatus: false,
          //   isDoneOCR: true,
          //   matchedSuccess: code === 400 ? false : true,
          //   msgOCR: 'OCR thất bại: ' + error,
          // });
          console.log("VerifyIdCardv2 ERROR: " + error);
        });
    }
  };

  //@ts-ignore
  const onChooseImage = (e, type: number) => {
    console.log("====================================");
    console.log("TARGET fILE: ", e.target.files[0]);
    console.log("====================================");
    if (type == 0) {
      setBackFile(e.target.files[0]);
    } else {
      setFrontFile(e.target.files[0]);
    }
  };

  return (
    <div className="upload-image-container">
      <span className="upload-image-title">Upload ảnh chụp giấy tờ</span>
      <div className="upload-image-form-ctn">
        <div className="upload-image-form">
          <span className="upload-image-form_title">Ảnh mặt trước</span>
          <img
            className="indentity-card-image"
            // src={this.state.IdentityCard[0]}
            id="front-image"
            alt="image"
          />
          <InputFileCustom
            label="upload Image"
            type={0}
            callback={onChooseImage}
            loadImagae={loadFile}
          />
        </div>
        <div className="upload-image-form">
          <span className="upload-image-form_title">Ảnh mặt sau</span>
          <img
            className="indentity-card-image"
            // src={this.state.IdentityCard[1]}
            id="back-image"
            alt="image"
          />
          <InputFileCustom
            label="upload Image"
            type={1}
            callback={onChooseImage}
            loadImagae={loadFile}
          />
        </div>
      </div>
      <button className="select-button" onClick={ocr}>
        {loadingOcr? 'Vui lòng chờ...' : 'Tiếp tục'}
      </button>
    </div>
  );
};

export default UploadIdentityCardScreen;
