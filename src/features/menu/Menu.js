import React, { Component } from "react";
import styles from "./Menu.module.css";
import DaysOfWeek from "./DaysOfWeek";
import HourRange from "./RangeSelect.js";
import RangeSelect from "./RangeSelect.js";
import MenuButton from "./MenuButton";
export default class Menu extends Component {
  render() {
    return (
      <div className={styles.menuContainer}>
        <div className={styles.sideBar}></div>
        <div className={styles.menu}>
          <div className={styles.menuSelect}>
            <DaysOfWeek />
            <div>
              <RangeSelect title="Hour Range" startVal="0:700" endVal="21:00" />
              <RangeSelect
                title="Date Range"
                startVal="2020/09/01/"
                endVal="2020/09/17"
              />
            </div>
            <div>
              <MenuButton name="Link Nodes" />
              <MenuButton name="Select Return Values" />
              <MenuButton name="Download Data as CSV" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
