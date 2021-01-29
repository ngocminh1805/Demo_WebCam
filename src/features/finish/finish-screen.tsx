import * as React from "react";
import CardInfoItem from "./components/card-info-item";
import "./finish-screen.css";
import { URL_FACE_VIDEO } from "../../helper/base";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

interface info {
  label: string;
  value: string;
}

const FinishScreen = () => {
  const [width, height] = useWindowSize();
  const [col1, setCol1] = React.useState([]);
  const [col2, setCol2] = React.useState([]);
  const [loadingLiveNess, setLoadingLiveNess] = React.useState(true);
  const [liveNessDone, setLineNessDone] = React.useState(false);
  const [compare, setCompare] = React.useState(false);
  const [faceImg, setFaceImg] = React.useState("");
  const location = useLocation();
  const [frontFile, setFrontFile] = React.useState(null);
  const [backFile, setBackFile] = React.useState(null);
  const history = useHistory();

  const token = localStorage.getItem("Token");
  const guiId = localStorage.getItem("UserInfo_guiId") || "";
  //@ts-ignore
  // const guiId = location.state.guiId;

  React.useEffect(() => {
    getdata();

    LiveNess();
  }, []);

  React.useEffect(() => {
    loadImg();
  });

  // --------------------- render Column user info ---------------------------------
  const renderLeftCol = () => {
    if (col1.length > 0) {
      return (
        <div className="column">
          {col1.map((item: { label: string; value: string }) => (
            <CardInfoItem label={item.label} value={item.value} />
          ))}
          <img
            className="image_card"
            id="finish-front-image"
            alt="front_image"
          />
        </div>
      );
    } else return <div></div>;
  };
  const renderRightCol = () => {
    if (col2.length > 0) {
      return (
        <div className="column">
          {col2.map((item: { label: string; value: string }) => (
            <CardInfoItem label={item.label} value={item.value} />
          ))}
          <img className="image_card" id="finish-back-image" alt="back_image" />
        </div>
      );
    } else return <div></div>;
  };

  // ------------------- read data info --------------------------------
  const getdata = () => {
    // @ts-ignore
    console.log("FINISH GET DATA:", location.state.file);
    //@ts-ignore
    console.log("FINISH USER INFO: ", location.state.userinfo);
    console.log("FINISH GUIID: ", guiId);
    //@ts-ignore
    const UserInfo = location.state.userinfo;
    //@ts-ignore
    console.log("File FrontImage: ", location.state.frontFile);
    //@ts-ignore
    console.log("File BackImage: ", location.state.backFile);

    //@ts-ignore
    setFrontFile(location.state.frontFile);
    //@ts-ignore
    setBackFile(location.state.backFile);

    //@ts-ignore
    col1.push({
      //@ts-ignore
      label: "Loại thẻ",
      //@ts-ignore
      value: UserInfo.cardType,
    });
    col1.push({
      //@ts-ignore
      label: "Chứng minh nhân dân số",
      //@ts-ignore
      value: UserInfo.id,
    });
    col1.push({
      //@ts-ignore
      label: "Họ và tên",
      //@ts-ignore
      value: UserInfo.fullName,
    });
    col1.push({
      //@ts-ignore
      label: "Ngày, tháng, năm sinh",
      //@ts-ignore
      value: UserInfo.dateOfBirth,
    });
    col1.push({
      //@ts-ignore
      label: "Quê quán",
      //@ts-ignore
      value: UserInfo.hometown,
    });
    col2.push({
      //@ts-ignore
      label: "Địa chỉ thường trú",
      //@ts-ignore
      value: UserInfo.addressResidence,
    });
    col2.push({
      //@ts-ignore
      label: "Giới tính",
      //@ts-ignore
      value: UserInfo.gender,
    });
    col2.push({
      //@ts-ignore
      label: "Ngày cấp",
      //@ts-ignore
      value: UserInfo.identCardIssueDate,
    });
    col2.push({
      //@ts-ignore
      label: "Có giá trị đến",
      //@ts-ignore
      value: UserInfo.expireDate,
    });
    col2.push({
      //@ts-ignore
      label: "Dân tộc/Quốc tịch",
      //@ts-ignore
      value: UserInfo.nation_ethnic,
    });
  };

  // ---------------- load Image ----------------------------
  const loadImg = () => {
    if (frontFile != null && backFile != null) {
      console.log("Render Image");

      var front_image = document.getElementById("finish-front-image");
      var back_image = document.getElementById("finish-back-image");
      //@ts-ignore
      front_image.src = URL.createObjectURL(frontFile);
      //@ts-ignore
      back_image.src = URL.createObjectURL(backFile);
    }
  };

  // ------------------ Live Ness-------------------------
  const LiveNess = async () => {
    setLoadingLiveNess(true);
    var formData = new FormData();

    //@ts-ignore
    const file = location.state.file;

    formData.append(
      "CaptureVideo",
      file,
      `CaptureVideo_${new Date().getTime()}.mp4`
    );

    formData.append("GuidID", guiId);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${token || ""}`,
      },
    };

    await axios.post(URL_FACE_VIDEO, formData, config).then((response) => {
      console.log("RESPONSE : ", response);
      const data = response.data.data;
      const status = response.status;
      if (status == 200) {
        console.log("====================================");
        console.log("DATA: ", data);
        console.log("====================================");
        const img = data.displayImage.slice(2, data.displayImage.length - 1);
        setFaceImg(img);
        setCompare(data.matchingResult);

        setLoadingLiveNess(false);
      } else {
        alert("ERROR :" + response.statusText);
        setLoadingLiveNess(false);
      }
    });
  };

  const title = () => {
    if (loadingLiveNess) {
      return (
        <span className="compare_title">
          Đang thực hiện so sánh khuôn mặt ...
        </span>
      );
    } else if (!loadingLiveNess && compare) {
      return (
        <span className="compare_title_true">
          Khuôn mặt trùng khớp với giấy tờ
        </span>
      );
    } else {
      return (
        <span className="compare_title_false">
          Khuôn mặt không trùng khớp với giấy tờ
        </span>
      );
    }
  };

  // ------------------ render btn -----------------------

  const renderBtn = () => {
    if (compare) {
      return (
        <button className="finish-screen-btn" onClick={onComplete}>
          hoàn tất đăng ký
        </button>
      );
    } else {
      <button className="finish-screen-btn" onClick={onComplete}>
        chụp lại khuôn mặt
      </button>;
    }
  };

  // ------------------ complete --------------------------

  const onComplete = () => {
    history.replace("/");
  };

  // console.log('State: ',this.state);

  return (
    <div className="finish-screen-container">
      <div className="finish-screen-container-header">
        <img src={"data:image/jpeg;base64," + faceImg} className="user-image" />
        {title()}
      </div>
      <div className="finish-screen-btn-container">
        {renderBtn()}
      </div>
      <div
        className="finish-screen-container-footer"
        style={{ height: height - 250 }}
      >
        <div className="list-item">{renderLeftCol()}</div>
        <div className="list-item">{renderRightCol()}</div>
      </div>
    </div>
  );
};

// resize screen
function useWindowSize() {
  const [size, setSize] = React.useState([0, 0]);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default FinishScreen;
