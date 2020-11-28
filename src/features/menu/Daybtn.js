import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class Daybtn extends Component {
  constructor(props) {
    super(props);
    const { day } = props
  }
  handleOnClick = () => {
    const {updateSelectedDays, day} = this.props
    updateSelectedDays(day)
  };
  render() {
    const { day } = this.props;


    return (
      <div
        onClick={this.handleOnClick}
        className={this.props.selected ? styles.dayBtnActive : styles.dayBtn}
      >
        <p>{day}</p>
      </div>
    );
  }
}
