import React, { Component } from "react";
import styles from "./Menu.module.css";
import Input from "@material-ui/core/Input";
export default class TimeSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      startVal,
      endVal,
      handleEndTimeChange,
      handleStartTimeChange,
    } = this.props;

    return (
      <div>
        <h4 class={styles.menuTitle}>{title}, Upper Bound Inclusive</h4>
        <div class={styles.selectDays}>
          <Input
            onChange={handleStartTimeChange}
            type="number"
            value={startVal}
            min="0"
            max="23"
          />
          <Input
            onChange={handleEndTimeChange}
            type="number"
            value={endVal}
            min="0"
            max="23"
          />
        </div>
      </div>
    );
  }
}
