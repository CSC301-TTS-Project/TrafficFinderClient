import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class Daybtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }
  handleOnClick = () => {
    this.setState({ active: !this.state.active });
  };
  render() {
    const { day } = this.props;

    return (
      <div
        onClick={this.handleOnClick}
        className={this.state.active ? styles.dayBtnActive : styles.dayBtn}
      >
        <p>{day}</p>
      </div>
    );
  }
}
