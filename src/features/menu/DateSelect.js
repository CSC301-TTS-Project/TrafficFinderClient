import React, { Component } from "react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

import Grid from "@material-ui/core/Grid";
export default class DateSelect extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { startDate, endDate } = this.props;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            label="End Date"
            format="MM/dd/yyyy"
            margin="normal"
            value={new Date()}
          />
          <KeyboardDatePicker
            label="Start Date"
            format="MM/dd/yyyy"
            margin="normal"
            value={new Date()}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
}
