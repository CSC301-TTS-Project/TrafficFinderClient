import React, { Component } from "react";
import styles from "./Menu.module.css";
import Input from "@material-ui/core/Input";
export default class TimeSelect extends Component {
  constructor(props) {
    super(props);
  }

  handleStartValInputChange = (e) => {
    const { onStartValChange } = this.props;
    onStartValChange(e.target.value);
  };

  handleEndValInputChange = (e) => {
    const { onEndValChange } = this.props;
    onEndValChange(e.target.value);
  };

  render() {
    const { title, startVal, endVal } = this.props;

    return (
      <div>
        <h4 class={styles.menuTitle}>{title}, Upper Bound Inclusive</h4>
        <div class={styles.selectDays}>
          <Input type="number" value={startVal}></Input>
          <Input type="number" value={endVal}></Input>
        </div>
      </div>
    );
  }
}
