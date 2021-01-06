import axios from "axios";
import * as React from "react";
import { URL_OCR } from "../../helper/base";
import InputFileCustom from "./components/inputfile-custom";
import "./Upload-Identity_Card_Screen.css";

interface Props {}
interface State {
  IdentityCard: Array<any>;
  token: string;
  frontFile: any;
  backFile: any;
  type: number;
  loadingOcr: boolean;
}

class UploadIdentityCardScreen extends React.PureComponent<Props, State> {
  urlXml: any;
  UserInfo:
    | {
        cardType: string;
        id: string;
        fullName: string;
        dateOfBirth: string;
        guiId: string;
        gender: string;
        nation_ethnic: string;
        hometown: string;
        addressResidence: string;
        expireDate: string;
        identCardIssueDate: string;
      }
    | undefined;
  //   UserInfo: { cardType: any; id: any; fullName: any; dateOfBirth: any; guiId: any; gender: any; nation_ethnic: any; hometown: any; addressResidence: any; expireDate: any; identCardIssueDate: any; };
  constructor(props: Props) {
    super(props);

    this.state = {
      IdentityCard: [],
      token: "",
      frontFile: null,
      backFile: null,
      type: 0,
      loadingOcr: false,
    };
  }

  componentDidMount() {
    const Token = localStorage.getItem("Token");
    console.log("Token_Upload_Identity: ", Token);
    //@ts-ignore
    this.setState({ token: Token });
  }
  componentDidUpdate(){
    // this.loadFile();
  }

  // -------------- load image -------------------------------
 //@ts-ignore
  loadFile = (e,type:number) => {
  if(type == 0){
    var front_image = document.getElementById('front-image');
    //@ts-ignore
    front_image.src = URL.createObjectURL(e.target.files[0]);
  }
  else{
    var back_image = document.getElementById('back-image');
    //@ts-ignore
    back_image.src = URL.createObjectURL(e.target.files[0]);
  }
  };

  // front_image = (pathFileListTemp: string[]) => {
  //   console.log("front_file_path: ", pathFileListTemp);

  //   this.setState({ FrontImage: pathFileListTemp });
  // };

  // back_image = (pathFileListTemp: string[]) => {
  //   console.log("back_file_path: ", pathFileListTemp);
  //   this.setState({ BackImage: pathFileListTemp });
  // };

  // ----------------------- choose iamge -----------------------------------
  // fileFrontSelector = buildFileSelector(false, this.front_image);
  // fileBackSelector = buildFileSelector(false, this.back_image);

  // SelectFrontImage = (e: any) => {
  //   e.preventDefault();
  //   console.log('====================================');
  //   console.log('FILE_FRONT_SELECTOR: ');
  //   console.log('====================================');
  //   this.fileFrontSelector.click();

  // };

  // SelectBackImage = (e: any) => {
  //   e.preventDefault();
  //   this.fileBackSelector.click();
  // };

  // ------------------ src image ------------------------------

  // ------------------- ocr -----------------------------------

  ocr = async () => {
    if (this.state.frontFile == null || this.state.backFile == null) {
      alert("Hãy nhập đủ thông tin ảnh");
    } else {
      this.setState({ loadingOcr: true });

      var formData = new FormData();
      // //@ts-ignore
      // var front = new Blob( this.state.FrontImage,{type:"image/jpeg"})
      // //@ts-ignore
      // var back = new Blob(this.state.BackImage)

      // console.log('====================================');
      // console.log('Front File: ',front);
      // console.log('====================================');
      // formData.append("IdCardFront", {
      //   //@ts-ignore
      //   uri: this.state.FrontImage[0],
      //   // uri:'E:/ảnh/trash/front.jpg',
      //   name: `FrontIdCard_${new Date().getTime()}.jpg`,
      //   type: "image/jpeg",
      // }
      // );
      formData.append(
        "IdCardFront",
        this.state.frontFile,
        `FrontIdCard_${new Date().getTime()}.jpg`
      );

      // formData.append("IdCardBack", {
      //   //@ts-ignore
      //   uri: this.state.BackImage[0],
      //   // uri:'E:/ảnh/trash/back.jpg',
      //   name: `BackIdCard_${new Date().getTime()}.jpg`,
      //   type: "image/jpeg",
      // });

      formData.append(
        "IdCardBack",
        this.state.backFile,
        `BackIdCard_${new Date().getTime()}.jpg`
      );

      const config = {
        headers: {
          // "Content-Type": "application/json",
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${this.state.token || ""}`,
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
          // this.urlXml = data?.urlXml;

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
            this.urlXml
          );
          if (
            (card?.msgDataFront != "" && card?.msgDataFront != null) ||
            (card?.msgDataBack != "" && card?.msgDataBack != null)
          ) {
            this.setState({ loadingOcr: false });
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
            this.UserInfo = {
              cardType: card?.identCardType || "",
              id: card?.identCardNumber || "",
              fullName: card?.identCardName || "",
              dateOfBirth: card?.identCardBirthDate || "",
              guiId: data.guidID,
              gender: card?.identCardGender,
              nation_ethnic:
                card?.identCardNation || card?.identCardEthnic || "",
              hometown: card?.identCardCountry || "",
              addressResidence: card?.identCardAdrResidence || "",
              expireDate: card?.identCardExpireDate || "",
              identCardIssueDate: card?.identCardIssueDate || "",
              // base64Image: data.resultStatus?.returnObj || '',
            };

            console.log("====================================");
            console.log("USER INFO :", this.UserInfo);
            console.log("====================================");

            localStorage.setItem("UserInfo_guiId", this.UserInfo.guiId);
            localStorage.setItem("UserInfo_cardType", this.UserInfo.cardType);
            localStorage.setItem("UserInfo_id", this.UserInfo.id);
            localStorage.setItem("UserInfo_fullName", this.UserInfo.fullName);
            localStorage.setItem("UserInfo_dateOfBirth", this.UserInfo.dateOfBirth);
            localStorage.setItem("UserInfo_nation_ethnic", this.UserInfo.nation_ethnic);
            localStorage.setItem("UserInfo_hometown", this.UserInfo.hometown);
            localStorage.setItem("UserInfo_addressResidence", this.UserInfo.addressResidence);
            localStorage.setItem("UserInfo_ expireDate", this.UserInfo.expireDate);
            localStorage.setItem("UserInfo_identCardIssueDate", this.UserInfo.identCardIssueDate);

            this.setState({ loadingOcr: false });
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
  onChooseFile = (e) => {
    console.log("====================================");
    console.log("TARGET fILE: ", e.target.files[0]);
    console.log("====================================");
    if (this.state.type <= 1) {
      const array = this.state.IdentityCard.concat(e.target.files[0]);
      this.setState({ IdentityCard: array, type: this.state.type + 1 });
    } else {
    }
  };

  //@ts-ignore
  onChooseImage = (e, type: number) => {
    console.log("====================================");
    console.log("TARGET fILE: ", e.target.files[0]);
    console.log("====================================");
    if (type == 0) {
      this.setState({ backFile: e.target.files[0] });
    } else {
      this.setState({ frontFile: e.target.files[0] });
    }
  };

  render() {
    return (
      <div className="upload-image-container">
        <span className="upload-image-title">Upload ảnh chụp giấy tờ</span>
        <div className="upload-image-form-ctn">
          <div className="upload-image-form">
            <span className="upload-image-form_title">Ảnh mặt trước</span>
            <img
              className="indentity-card-image"
              // src={this.state.IdentityCard[0]}
              id = 'front-image'
              alt="image"
            />
            <InputFileCustom
              label="upload Image"
              type={0}
              callback={this.onChooseImage}
              loadImagae = {this.loadFile}
            />
          </div>
          <div className="upload-image-form">
            <span className="upload-image-form_title">Ảnh mặt sau</span>
            <img
              className="indentity-card-image"
              // src={this.state.IdentityCard[1]}
              id = 'back-image'
              alt="image"
            />
            <InputFileCustom
              label="upload Image"
              type={1}
              callback={this.onChooseImage}
              loadImagae = {this.loadFile}
            />
          </div>
        </div>
        <button className="select-button" onClick={this.ocr}>
          Tiếp tục
        </button>
      </div>
    );
  }
}

export default UploadIdentityCardScreen;
