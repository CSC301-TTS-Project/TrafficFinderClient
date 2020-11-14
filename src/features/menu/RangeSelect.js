import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class RangeSelect extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { title, startVal, endVal } = this.props;
    return (
      <div>
        <h4 className={styles.menuTitle}>{title}</h4>
        <input type="text" value={startVal} className={styles.rangeInput} />
        <span className={styles.tilda}>~</span>
        <input type="text" value={endVal} className={styles.rangeInput} />
      </div>
    );
  }
}
