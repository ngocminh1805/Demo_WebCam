import * as React from "react";
import Webcam from "react-webcam";
import "./webcam.css";
import {URL_FACE_VIDEO} from '../../helper/base'
import axios from "axios";

interface Props {}
interface State {
  screenshot: any;
  tab: number;
  recording: boolean;
  recordedChunks: any;
  guiId: string;
  file_video: any
  token:string
}

class WebCam extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      screenshot: null,
      tab: 0,
      recording: false,
      recordedChunks: [],
      guiId: "",
      file_video: null,
      token:''
    };
  }

  componentDidMount() {
    const GUIID = localStorage.getItem("UserInfo_ guiId") || "";
    const Token = localStorage.getItem("Token") || '';
    
    this.setState({ guiId: GUIID, token:Token });
  }

  webcamRef = React.createRef<Webcam>();
  mediaRecorderRef = React.createRef<MediaRecorder>();
  handleClick = () => {
    const screenshot = this.webcamRef.current?.getScreenshot();
    console.log("SCREEN SHOT : ", screenshot);

    this.setState({ screenshot });
  };
  /// ------------------------------------------------
  onStartRecord = () => {
    this.setState({ recording: true });
    // @ts-ignore
    this.mediaRecorderRef.current = new MediaRecorder(
      // @ts-ignore
      this.webcamRef.current?.stream,
      {
        // mimeType: "video/webm;codecs=h264",
        mimeType: "video/webm;codecs=vp9",
        // mimeType: "video/webm",
      }
    );
    this.mediaRecorderRef.current.addEventListener(
      "dataavailable",
      this.handleDataAvailable
    );
    this.mediaRecorderRef.current.start();
  };

  /// --------------------------------------------------
  //@ts-ignore
  handleDataAvailable = ({ data }) => {
    console.log('DATA :', data);
    if (data.size > 0) {
      this.setState({ recordedChunks: this.state.recordedChunks.concat(data) });
    }
  };

  /// ----------------------------------------------

  onStopRecord = () => {
    this.mediaRecorderRef.current?.stop();
    this.setState({ recording: false });
    // console.log("====================================");
    // console.log("RECORDS_CHUNKS : ", this.state.recordedChunks);
    // console.log("====================================");

    // const blob = new Blob(this.state.recordedChunks, {
    //   type: "video/mp4",
    // });
    // const url = URL.createObjectURL(blob);

    // const file = new File(this.state.recordedChunks, "video.mp4", {
    //   type: "video/mp4",
    // });

    // console.log('====================================');
    // console.log('Blob :', this.state.recordedChunks);
    // console.log("VIDEO_URL :", url);
    // console.log("FILE_VIEDO :", file);
    // console.log("====================================");
  };

  // ----------------
  handleDownload = () => {
    if (this.state.recordedChunks.length) {
      const blob = new Blob(this.state.recordedChunks, {
        type: "video/mp4",
      });
      const url = URL.createObjectURL(blob);
      

      const file = new File(this.state.recordedChunks, "video.mp4", {
        type: "video/mp4",
      });
  
      console.log('====================================');
      console.log('Blob :', this.state.recordedChunks);
      console.log("VIDEO_URL :", url);
      console.log("FILE_VIEDO :", file);
      console.log("====================================");

      const a = document.createElement("a");
      document.body.appendChild(a);
      // @ts-ignore
      // a.style = "display: none";
      // a.href = url;
      // a.download = "react-webcam.mp4";
      // a.click();
      // window.URL.revokeObjectURL(url);
      // this.setState({ recordedChunks: [] });
      this.playVideo();
      this.verifyFace();
       this.setState({ recordedChunks: [] });
    }
  };

  //
  renderButton = () => {
    if (this.state.recording) {
      return (
        <button className="camera_button" onClick={this.onStopRecord}>
          stop record
        </button>
      );
    } else {
      return (
        <button className="camera_button" onClick={this.captureVideo}>
          start record
        </button>
      );
    }
  };

  //

  renderDowloadBtn = () => {
    if (this.state.recordedChunks.length > 0) {
      return (
        <button className="camera_button" onClick={this.handleDownload}>
          Download
        </button>
      );
    }
  };

  // ---------------------- Quay video --------------------------

  captureVideo = () => {
    this.onStartRecord();
    // setTimeout(this.onStopRecord, 3500);
    // this.handleDownload();
  };

  // 

  playVideo=()=>{
    var video = document.getElementById('preview-video');
    const blob = new Blob(this.state.recordedChunks, {
      type: "video/mp4",
    });
    const url = URL.createObjectURL(blob);
    //@ts-ignore
    video.src = url;
    console.log('LINK_BLOB_VIDEO_PLAY: ', url);
    
      //@ts-ignore
    video.load();
      //@ts-ignore
    video.onloadeddata = function() {
        //@ts-ignore
        video.play();
    }
  }

  verifyFace = async () => {
    var formData = new FormData();
    const file = new File(this.state.recordedChunks, "video.mp4", {
      type: "video/mp4",
    });

    formData.append(
      "CaptureVideo",
      file,
      `CaptureVideo_${new Date().getTime()}.mp4`
    );

    formData.append('GuidID',this.state.guiId);

    const config = {
      headers: {
        // "Content-Type": "application/json",
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${this.state.token || ""}`,
      },
    };

    await axios
    .post(URL_FACE_VIDEO, formData, config)
    .then((response) => {
      console.log('RESPONSE : ', response);
      
    })
  }

  render() {
    console.log("====================================");
    console.log("GUIID :", this.state.guiId);
    console.log("====================================");
    return (
      <div className="webcam_ctn">
        <Webcam
          height={720}
          width={1024}
          mirrored={true}
          screenshotFormat="image/jpeg"
          ref={this.webcamRef}
        />
        <div>
          <button className="camera_button" onClick={this.handleClick}>
            Capture
          </button>
          {this.renderButton()}
          {this.renderDowloadBtn()}
        </div>
        <img src={this.state.screenshot} />
        <video id = 'preview-video'></video>
      </div>
    );
  }
}

export default WebCam;
