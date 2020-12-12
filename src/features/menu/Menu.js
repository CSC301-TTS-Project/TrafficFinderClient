import React, { Component } from "react";
import styles from "./Menu.module.css";
import DaysOfWeek from "./DaysOfWeek";
import TimeSelect from "./TimeSelect.js";
import MenuButton from "./MenuButton";
import DateSelect from "./DateSelect";
import SelectReturnValues from "./SelectReturnValues";
import { format } from "date-fns";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import { makeStyles } from "@material-ui/core/styles";

import "./Menu.module.css";
import { ENDPOINT, authenticatedFetch } from "../requests";

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: true,
      selectedDaysofWeek: [],
      selectedStartHour: 7,
      selectedEndHour: 19,

      selectedStartDate: new Date("September, 01, 2018"), //eg "2018-09-01", default value of calendar cannot be removed
      selectedEndDate: new Date("September, 07, 2018"), //eg "2018-09-07"
      // selected return values in this order:
      // all selected by default (15 values + route num which is added on download request)
      // num_days,link_obs,min_speed,mean_speed,max_speed,
      // pct_50_speed,pct_85_speed,std_dev_speed,min_tt,mean_tt,max_tt,
      // std_dev_tt,total_length,full_link_obs”
      selectedReturnValues: Array.from({ length: 15 }, () => 1),
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
  formatDate = (date) => {
    const newDate = format(date, "yyyy-MM-dd");
    return format(date, "yyyy-MM-dd");
  };
  updateSelectedReturnValues = (indexToUpdate) => {
    const { selectedReturnValues } = this.state;

    const newSelectedReturnValues = selectedReturnValues.map(function (val, i) {
      if (i === indexToUpdate) {
        if (val === 1) {
          return 0;
        } else {
          return 1; // i === 0
        }
      }
      return val;
    });

    this.setState({ selectedReturnValues: newSelectedReturnValues });
  };

  render() {
    const logoutCallback = this.props.logoutCallback;
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
                <SelectReturnValues
                  selectedReturnValues={this.state.selectedReturnValues}
                  onSelectedValuesChange={this.updateSelectedReturnValues}
                />
                <>
                  <MenuButton
                    name="Download GeoJson"
                    onClick={
                      //Check that selectedEndHour and selectedStartHour is filled
                      this.state.selectedEndHour !== "" &&
                        this.state.selectedStartHour !== ""
                        ? () => {
                          authenticatedFetch(`${ENDPOINT}/api/getGeoJson`, this.props.usrAuthToken, {
                            method: "POST",
                            body: JSON.stringify({
                              route: 0,
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
                              link.setAttribute("download", "data.geojson");
                              document.body.appendChild(link);
                              link.click();
                              link.parentNode.removeChild(link);
                            })
                            .catch((error) => {
                              console.log("Fetch error " + error);
                            });
                        }
                        : () => null
                    }
                  />
                  <MenuButton
                    name="Download as CSV"
                    onClick={
                      //Check that selectedEndHour and selectedStartHour is filled
                      this.state.selectedEndHour !== "" &&
                        this.state.selectedStartHour !== ""
                        ? () => {
                          authenticatedFetch(`${ENDPOINT}/api/getTrafficData`, this.props.usrAuthToken, {
                            method: "POST",
                            body: JSON.stringify({
                              route: 0,
                              date_range: [
                                this.formatDate(this.state.selectedStartDate),
                                this.formatDate(this.state.selectedEndDate),
                              ],
                              days_of_week: this.state.selectedDaysofWeek,
                              hour_range: [
                                Number(this.state.selectedStartHour),
                                Number(this.state.selectedEndHour),
                              ],
                              // for selections: '0' (corresponding to index 0) is for route_num
                              // (not selected by user but can be returned by back-end)
                              selections: [
                                0,
                                ...this.state.selectedReturnValues,
                              ],
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
                              link.setAttribute("download", "data.");
                              document.body.appendChild(link);
                              link.click();
                              link.parentNode.removeChild(link);
                            })
                            .catch((error) => {
                              console.log("Fetch error " + error);
                            });
                        }
                        : () => null
                    }
                  />
                  <p style={{ margin: "0px", textAlign: "center" }}>
                    For data download:
                    <li>A segment must be drawn on the map</li>
                    <li>All fields in the form must be filled in</li>
                  </p>
                  <MenuButton name="Logout" onClick={() => { logoutCallback() }} />
                </>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
