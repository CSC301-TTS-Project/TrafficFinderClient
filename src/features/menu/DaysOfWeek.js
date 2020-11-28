import React, { Component } from "react";
import Daybtn from "./Daybtn";
import styles from "./Menu.module.css";
import { v4 as uuid } from "uuid";
export default class DaysOfWeek extends Component {
  render() {
    const { selectedDays } = this.props
    console.log("selected days", selectedDays)
    
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    return (
      <div>
        <h4 className={styles.menuTitle}>Days of Week</h4>
        <div className={styles.selectDays}>
          {daysOfWeek.map((day) => (
            <Daybtn key={uuid()} day={day} 
            selected={false} // here would check contents from selectedDays 
            />
          ))}
        </div>
      </div>
    );
  }
}
