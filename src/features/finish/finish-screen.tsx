import * as React from "react";
import CardInfoItem from "./components/card-info-item";
import "./finish-screen.css";

interface Props {}
interface State {
  height: number;
  width: number;
}

class FinishScreen extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
  }

  data = [
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
    { label: "Loại thẻ", value: "GIẤY CHỨNG MINH THƯ NHÂN DÂN" },
  ];

  componentDidMount() {
    window.addEventListener("resize", this.updateWidthAndHeight);
  }

  updateWidthAndHeight = () => {
    this.setState({ height: window.innerHeight, width: window.innerWidth });
  };

  listItem = this.data.map((item) => (
    <CardInfoItem label={item.label} value={item.value} />
  ));

  render() {
    return (
      <div className="finish-screen-container">
        <div className="finish-screen-container-header">
          <img
            src="https://www.w3schools.com/w3css/img_forest.jpg"
            className="user-image"
          />
          <span className="compare_title">
            Đang thực hiện so sánh khuôn mặt ...
          </span>
        </div>
        <div
          className="finish-screen-container-footer"
          style={{ height: this.state.height - 250 }}
        >
         {this.listItem}
        </div>
      </div>
    );
  }
}

export default FinishScreen;
