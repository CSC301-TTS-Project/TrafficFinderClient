import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class Daybtn extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { day } = this.props;
    return (
      <div className={styles.dayBtn}>
        <p>{day}</p>
      </div>
    );
  }
}
