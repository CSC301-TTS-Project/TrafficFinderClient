import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class Daybtn extends Component {
  constructor(props) {
    super(props);
    const { day } = props
    this.state = {
      // Tues-Thurs should be active for default time period
      active: day === "T" || day === "W"  ? true : false,
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
