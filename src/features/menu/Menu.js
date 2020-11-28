import React, { Component } from "react";
import styles from "./Menu.module.css";
import DaysOfWeek from "./DaysOfWeek";
import RangeSelect from "./RangeSelect.js";
import MenuButton from "./MenuButton";
import SelectReturnValues from "./SelectReturnValues";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import { makeStyles } from "@material-ui/core/styles";

import "./Menu.module.css";
import { ENDPOINT } from "../requests";

export default class Menu extends Component {
  constructor() {
    super();
    this.state = {
      menuOpen: false,
      selectedDaysofWeek:[],
      selectedStartHour: undefined, // format rn: '7' not '07:00'
      selectedEndHour: undefined // format rn: '7' not '07:00'
    };
  }

  handleMenuOpen = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  updateSelectedDays = (dayToChange) => {
    const {selectedDaysofWeek}  = this.state
    let newSelectedDays

    if(selectedDaysofWeek.includes(dayToChange)){
      newSelectedDays = selectedDaysofWeek.filter(function(day) {
        return day !== dayToChange
      })
    }
    else{
      newSelectedDays = [...selectedDaysofWeek]
      newSelectedDays.push(dayToChange)
      
    }
    this.setState({
      selectedDaysofWeek: newSelectedDays,
    });
  }

  updateSelectedStartHour = (newStartHour)=>{
    this.setState({selectedStartHour:newStartHour})
  }

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
              <DaysOfWeek selectedDays={this.state.selectedDaysofWeek} updateSelectedDays={this.updateSelectedDays}/>
              <div>
                <RangeSelect
                  title="Hour Range"
                  startVal={this.state.selectedStartHour}
                  endVal={this.state.selectedEndHour}
                  onStartValChange={this.updateSelectedStartHour}
                  onEndValChange={()=>console.log("hi end val")}
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
                  fetch(`${ENDPOINT}/api/getTrafficData`, {
                    method: "POST",
                    body: JSON.stringify({
                      "route": 0,
                      "date_range": ["2018-09-01", "2018-09-07"],
                      "days_of_week": this.state.selectedDaysofWeek,
                      "hour_range": [Number(this.state.selectedStartHour), 13]
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
