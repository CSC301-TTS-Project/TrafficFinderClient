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
    const {updateSelectedDays, day} = this.props
    console.log("calling props handler update sel days")
    updateSelectedDays(day)
  };
  render() {
    const { day } = this.props;


    return (
      <div
        onClick={this.handleOnClick}
        // className={this.state.active ? styles.dayBtnActive : styles.dayBtn}
        className={this.props.selected ? styles.dayBtnActive : styles.dayBtn}
      >
        <p>{day}</p>
      </div>
    );
  }
}
