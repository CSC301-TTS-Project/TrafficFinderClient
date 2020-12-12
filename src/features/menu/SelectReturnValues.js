import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Checkbox from "@material-ui/core/Checkbox";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import styles from "./Menu.module.css";

const checkLists = [
  // also included in output: route_num
  "Number of days", // num_days
  "Link observations (coverage)", // link_obs
  "Minimum speed", //min_speed
  "Mean speed", //mean_speed
  "Maximum speed", // max_speed
  "Median speed", // pct_50_speed
  "85th percentile speed", // pct_85_speed
  "95th percentile speed", //pct_95_speed
  "Standard deviation of speed", // std_dev_speed
  "Minimum travel time", // min_tt
  "Mean travel time", // mean_tt
  "Maximum travel time", // max_tt,
  "Standard deviation of travel time", // std_dev_tt,
  "Total length", // total_length,
  "Full link observations (complete coverage)", // full_link_obs”
];

const CheckBox = ({ id, value, checked, onChange, title }) => {
  return (
    <div>
      <Checkbox checked={checked} color="default" onChange={onChange} />
      {/* <input
        className={}
        id={id}
        type="checkbox"
        name="inputNames"
        checked={checked}
        onChange={onChange}
        value={value}
      /> */}
      {title}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: " #fafafa",
    outline: "none",
    borderRadius: "5px",
    padding: theme.spacing(4, 17, 4),
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const { selectedReturnValues, onSelectedValuesChange } = props;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={styles.menuBtnContainer}>
      <button className={styles.menuBtn} onClick={handleOpen}>
        Select Return Values
      </button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper} style={{ height: "80vh", width: 800 }}>
            <h1 className={styles.modalTitle}>Return Values</h1>
            <Grid container spacing={3}>
              {checkLists.map((item, index) => {
                return (
                  <Grid item xs={4}>
                    <label htmlFor={`id_${index}`} key={`key_${index}`}>
                      <CheckBox
                        id={index}
                        value={item}
                        onChange={() => onSelectedValuesChange(index)}
                        checked={selectedReturnValues[index] === 1}
                        title={item}
                      />
                    </label>
                  </Grid>
                );
              })}
            </Grid>
            <div style={{ textAlign: "center", paddingTop: 10 }}>
              <button className={styles.primaryBtn} onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
