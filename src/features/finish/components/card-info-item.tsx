import * as React from "react";
import "./card-info-item.css";

interface Props {
  label: string;
  value: string;
}

interface State {
  value: string;
}

class CardInfoItem extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.value,
    };
  }

  onChangeText = (value: string) => {
    this.setState({ value: value });
  };

  render() {
    const { label } = this.props;
    return (
      <div className="card-info-item-container">
        <span className="card-info-item-label">{label}</span>
        <input
          className="card-info-item-value"
          value={this.state.value}
          onChange={(event) => this.onChangeText(event.target.value)}
        />
      </div>
    );
  }
}

export default CardInfoItem;
