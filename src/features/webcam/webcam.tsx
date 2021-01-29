import * as React from "react";
import Webcam from "react-webcam";
import "./webcam.css";
import { URL_FACE_VIDEO } from "../../helper/base";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { userInfo } from "os";

const WebCam = () => {
  const [recording, setRecording] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [loadingVerifyFace, setLoadingVerifyFace] = React.useState(false);

  const webcamRef = React.createRef<Webcam>();
  const mediaRecorderRef = React.createRef<MediaRecorder>();
  const history = useHistory();
  const location = useLocation();
  //@ts-ignore
  const guiId = location.state.guiId;

  // const handleClick = () => {
  //   const screenshot = webcamRef.current?.getScreenshot();
  //   console.log("SCREEN SHOT : ", screenshot);
  // };

  /// ------------- start record -----------------------------------
  const onStartRecord = React.useCallback(() => {
    setRecording(true);
    // setRecordedChunks([]);
    //@ts-ignore
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current?.stream, {
      mimeType: "video/webm;vp8",
    });
    mediaRecorderRef.current?.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current?.start();
  }, [webcamRef, setRecording, mediaRecorderRef]);

  /// ------------ handle data ---------------------------
  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        console.log("data...");
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  /// --------- stop record -----------------------------
  const onStopRecord = React.useCallback(() => {
    //@ts-ignore
    mediaRecorderRef.current.stop();
    setRecording(false);
  }, [mediaRecorderRef, webcamRef, setRecording]);

  // ------------------ dowload ------------------------------

  const handleDownload = React.useCallback(() => {
    console.log("====================================");
    console.log("RECORDED CHUNKS :", recordedChunks);
    console.log("====================================");
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      //@ts-ignore
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.mp4";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  // --------------------- continue --------------------------

  const handleContinue = React.useCallback(() => {
    console.log("====================================");
    console.log("RECORDED CHUNKS :", recordedChunks);
    console.log("====================================");

    // if (recordedChunks.length) {
    //   playVideo();
    //   verifyFace();
    // }
    const file = new File(recordedChunks, "video.mp4", {
      type: "video/mp4",
    });
    console.log("====================================");
    console.log("FILE :", file);
    //@ts-ignore
    console.log("USER INFO :", location.state.userinfo);

    console.log("====================================");

    history.push("/finish", {
      file: file,
      //@ts-ignore
      userinfo: location.state.userinfo,
      //@ts-ignore
      frontFile: location.state.frontFile,
      //@ts-ignore
      backFile: location.state.backFile,
      guiId:guiId
    });
  }, [recordedChunks]);

  //
  const renderButton = () => {
    // if (recording) {
    //   return (
    //     <button className="camera_button" onClick={onStopRecord}>
    //       stop record
    //     </button>
    //   );
    // } else {
      return (
        <button className="camera_button" onClick={captureVideo}>
          {recording? 'Đang chụp khuôn mặt ...' : 'Chụp khuôn mặt'}
        </button>
      );
    // }
  };

  //

  const renderDowloadBtn = () => {
    if (recordedChunks.length > 0) {
      return (
        <button className="camera_button" onClick={handleContinue}>
          Tiếp tục
        </button>
      );
    }
  };

  // ---------------------- Quay video --------------------------

  const captureVideo = () => {
    onStartRecord();
    setTimeout(onStopRecord, 3500);
    // handleDownload();
  };

  const playVideo = () => {
    var video = document.getElementById("preview-video");
    const blob = new Blob(recordedChunks, {
      type: "video/mp4",
    });
    const url = URL.createObjectURL(blob);
    //@ts-ignore
    video.src = url;
    console.log("LINK_BLOB_VIDEO_PLAY: ", url);

    //@ts-ignore
    video.load();
    //@ts-ignore
    video.onloadeddata = function () {
      //@ts-ignore
      video.play();
    };
  };

  const verifyFace = async () => {
    setLoadingVerifyFace(true);
    var formData = new FormData();
    const token = localStorage.getItem("Token");
    const guiId = localStorage.getItem("UserInfo_ guiId") || "";
    const file = new File(recordedChunks, "video.mp4", {
      type: "video/mp4",
    });

    formData.append(
      "CaptureVideo",
      file,
      `CaptureVideo_${new Date().getTime()}.mp4`
    );

    formData.append("GuidID", guiId);

    const config = {
      headers: {
        // "Content-Type": "application/json",
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${token || ""}`,
      },
    };

    await axios.post(URL_FACE_VIDEO, formData, config).then((response) => {
      console.log("RESPONSE : ", response);
      setLoadingVerifyFace(false);
      // history.push('/finish')
    });
  };

  return (
    <div className="webcam_ctn">
      <Webcam
        height={720}
        width={1024}
        mirrored={true}
        screenshotFormat="image/jpeg"
        ref={webcamRef}
      />
      <div>
        {/* <button className="camera_button" onClick={handleClick}>
          Capture
        </button> */}
        {renderButton()}
        {renderDowloadBtn()}
      </div>

      {/* <img src={screenshot} /> */}
      <video id="preview-video"></video>
    </div>
  );
};

export default WebCam;
