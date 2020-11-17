import React, { Component } from "react";
import styles from "./Menu.module.css";
import DaysOfWeek from "./DaysOfWeek";
import RangeSelect from "./RangeSelect.js";
import MenuButton from "./MenuButton";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import { makeStyles } from "@material-ui/core/styles";

import "./Menu.module.css";

export default class Menu extends Component {
  constructor() {
    super();
    this.state = {
      menuOpen: false,
    };
  }

  handleMenuOpen = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  render() {
    return (
      <>
        <ChevronRightOutlinedIcon
          fontSize="large"
          className={
            this.state.menuOpen ? styles.menuChevronOpen : styles.menuChevron
          }
          style={{ transition: "all ease-in-out 150ms" }}
          onClick={this.handleMenuOpen}
        />
        <div
          className={
            this.state.menuOpen
              ? styles.menuContainer
              : styles.menuContainerClosed
          }
        >
          <div className={styles.sideBar}></div>
          <div className={styles.menu}>
            <div className={styles.menuSelect}>
              <DaysOfWeek />
              <div>
                <RangeSelect
                  title="Hour Range"
                  startVal="0:700"
                  endVal="10:00"
                />
                <RangeSelect
                  title="Date Range"
                  startVal="2020/09/01/"
                  endVal="2020/09/17"
                />
              </div>
              <div>
                <MenuButton name="Select Return Values" />
                <MenuButton name="Download Data as CSV" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
