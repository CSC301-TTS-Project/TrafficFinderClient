import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class MenuButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { name } = this.props;
    return (
      <div className={styles.menuBtnContainer}>
        <button className={styles.menuBtn}>{name}</button>
      </div>
    );
  }
}
