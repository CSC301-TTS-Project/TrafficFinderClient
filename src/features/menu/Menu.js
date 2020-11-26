import React, { Component } from "react";
import styles from "./Menu.module.css";
import DaysOfWeek from "./DaysOfWeek";
import RangeSelect from "./RangeSelect.js";
import MenuButton from "./MenuButton";
import SelectReturnValues from "./SelectReturnValues";
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
                  startVal="07:00"
                  endVal="13:00"
                />
                <RangeSelect
                  title="Date Range"
                  startVal="2018-09-01"
                  endVal="2018-09-07"
                />
              </div>
              <div>
                <SelectReturnValues />
                <MenuButton name="Download as CSV" onClick={() => {
                  fetch("http://Tfsd2-env.eba-2rmc52x2.us-east-2.elasticbeanstalk.com/api/getTrafficData", {
                    method: "POST",
                    body: JSON.stringify({
                      "route": 0,
                      "date_range": ["2018-09-01", "2018-09-07"],
                      "days_of_week": [0, 3, 5],
                      "hour_range": [7, 13]
                    })
                  }).then((response) => {
                    if (response.status !== 200) {
                      console.log("There was a problem, Status code: " + response.status)
                      return
                    } else {
                      return response.blob()
                    }
                  }).then((blob) => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'data.csv');
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                  }).catch((error) => {
                    console.log("Fetch error " + error)
                  })
                }
                }/>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
