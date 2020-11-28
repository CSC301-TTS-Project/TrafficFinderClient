import React, { Component } from "react";
import Daybtn from "./Daybtn";
import styles from "./Menu.module.css";
import { v4 as uuid } from "uuid";
export default class DaysOfWeek extends Component {
  render() {
    const { selectedDays, updateSelectedDays } = this.props
    console.log("selected days DOW comp", selectedDays)

    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
    return (
      <div>
        <h4 className={styles.menuTitle}>Days of Week</h4>
        <div className={styles.selectDays}>
          {daysOfWeek.map((day) => (
            <Daybtn key={uuid()} day={day} 
            // selected={false} // here would check contents from selectedDays 
            selected={selectedDays.includes(day)}
            updateSelectedDays={updateSelectedDays}
            />
          ))}
        </div>
      </div>
    );
  }
}
