import React, { Component } from "react";
import styles from "./Menu.module.css";

const dayIndexToText = {0: "S", 1:"M", 2:"T", 3: "W", 4:"T", 5: "F", 6:"S"}

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
        <p>{dayIndexToText[day]}</p>
      </div>
    );
  }
}
