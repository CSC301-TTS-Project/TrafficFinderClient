import React, { Component } from "react";
import styles from "./Menu.module.css";
import DaysOfWeek from "./DaysOfWeek";
import TimeSelect from "./TimeSelect.js";
import MenuButton from "./MenuButton";
import DateSelect from "./DateSelect";
import SelectReturnValues from "./SelectReturnValues";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import { makeStyles } from "@material-ui/core/styles";

import "./Menu.module.css";
import { ENDPOINT } from "../requests";

export default class Menu extends Component {
  constructor() {
    super();
    this.state = {
      menuOpen: true,
      selectedDaysofWeek: [],
      selectedStartHour: undefined,
      selectedEndHour: undefined,
      selectedStartDate: undefined, //eg "2018-09-01"
      selectedEndDate: undefined, //eg "2018-09-07"
    };
  }

  handleMenuOpen = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  updateSelectedDays = (dayToChange) => {
    const { selectedDaysofWeek } = this.state;
    let newSelectedDays;

    if (selectedDaysofWeek.includes(dayToChange)) {
      newSelectedDays = selectedDaysofWeek.filter(function (day) {
        return day !== dayToChange;
      });
    } else {
      newSelectedDays = [...selectedDaysofWeek];
      newSelectedDays.push(dayToChange);
    }
    this.setState({
      selectedDaysofWeek: newSelectedDays,
    });
  };

  updateSelectedStartHour = (e) => {
    const newStartHour = e.target.value;

    if (newStartHour < 0) {
      this.setState({ selectedStartHour: 0 });
    } else if (newStartHour > 23) {
      this.setState({ selectedStartHour: 23 });
    } else {
      this.setState({ selectedStartHour: newStartHour });
    }
  };

  updateSelectedEndHour = (e) => {
    const newEndHour = e.target.value;
    if (newEndHour < 0) {
      this.setState({ selectedEndHour: 0 });
    } else if (newEndHour > 23) {
      this.setState({ selectedEndHour: 23 });
    } else {
      this.setState({ selectedEndHour: newEndHour });
    }
  };

  handleStartDate = (newStartDate) => {
    this.setState({ selectedStartDate: newStartDate });
  };

  handleEndDate = (newEndDate) => {
    this.setState({ selectedEndDate: newEndDate });
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
              <DaysOfWeek
                selectedDays={this.state.selectedDaysofWeek}
                updateSelectedDays={this.updateSelectedDays}
              />
              <div>
                <TimeSelect
                  title="Hour Range (0-23)"
                  startVal={this.state.selectedStartHour}
                  endVal={this.state.selectedEndHour}
                  handleStartTimeChange={this.updateSelectedStartHour}
                  handleEndTimeChange={this.updateSelectedEndHour}
                />
                <DateSelect
                  handleStartDate={this.handleStartDate}
                  handleEndDate={this.handleEndDate}
                  startDate={this.state.selectedStartDate}
                  endDate={this.state.selectedEndDate}
                />
              </div>
              <div>
                {/* hide select return values button and modal until integration for custom return values is implemented*/}
                {/* will download all return values by default*/}
                {/* <SelectReturnValues /> */}
                <>
                  <MenuButton
                    name="Download as CSV"
                    onClick={() => {
                      fetch(`${ENDPOINT}/api/getTrafficData`, {
                        method: "POST",
                        body: JSON.stringify({
                          route: 0,
                          date_range: [
                            this.state.selectedStartDate,
                            this.state.selectedEndDate,
                          ],
                          days_of_week: this.state.selectedDaysofWeek,
                          hour_range: [
                            Number(this.state.selectedStartHour),
                            Number(this.state.selectedEndHour),
                          ],
                          selections: [
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                            1,
                          ], // 16 return values
                        }),
                      })
                        .then((response) => {
                          if (response.status !== 200) {
                            console.log(
                              "There was a problem, Status code: " +
                                response.status
                            );
                            return;
                          } else {
                            return response.blob();
                          }
                        })
                        .then((blob) => {
                          const url = window.URL.createObjectURL(
                            new Blob([blob])
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute("download", "data.csv");
                          document.body.appendChild(link);
                          link.click();
                          link.parentNode.removeChild(link);
                        })
                        .catch((error) => {
                          console.log("Fetch error " + error);
                        });
                    }}
                  />
                  <p style={{ margin: "0px", textAlign: "center" }}>
                    For data download:
                    <li>A segment must be drawn on the map</li>
                    <li>All fields in the form must be filled in</li>
                  </p>
                </>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
