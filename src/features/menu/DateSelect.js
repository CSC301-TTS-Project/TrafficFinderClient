import React, { Component } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import styles from "./Menu.module.css";
import Grid from "@material-ui/core/Grid";

const calendarTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#9a21f9",
    },
  },
});
export default class DateSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { startDate, endDate, handleStartDate, handleEndDate } = this.props;
    console.log(this.props);
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} style={styles.calendar}>
        <ThemeProvider theme={calendarTheme}>
          <h4 class={styles.menuTitle}>Pick date</h4>
          <Grid container justify="space-around" spacing={3}>
            <Grid item xs={6}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                label="Start Date"
                format="MM/dd/yyyy"
                margin="normal"
                value={startDate}
                onChange={handleStartDate}
              />
            </Grid>
            <Grid item xs={6}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                label="End Date"
                format="MM/dd/yyyy"
                margin="normal"
                value={endDate}
                onChange={handleEndDate}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}
