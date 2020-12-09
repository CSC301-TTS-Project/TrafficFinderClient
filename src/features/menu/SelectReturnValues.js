import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Checkbox from "@material-ui/core/Checkbox";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import styles from "./Menu.module.css";

const checkLists = [
  // also included in output: route_num (always '0' for single segment)
  "Mean travel time",
  "Standard deviation of travel time",
  "Min travel time",
  "Max travel time",
  "Mean speed",
  "Standard deviation of speed",
  "Min speed",
  "Max speed",
  "Median speed",
  "85th percentile speed",
  "95th percentile speed", 
  "Number of days",
  "Total length",
  "Sample count (observations and complete coverage)" // counts as 2 values (link obs and full link obs)
];

const CheckBox = ({ id, value, checked, onChange, title }) => {
  return (
    <div>
      <Checkbox checked={checked} color="default" />
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

export default function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleChange = (e) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.id]: e.target.checked,
    });
    console.log("checkedItems:", checkedItems);
  };

  const saveDataBtn = (e) => {
    e.preventDefault();
    const dataPushArray = Object.entries(checkedItems).reduce(
      (pre, [key, value]) => {
        value && pre.push(key);
        return pre;
      },
      []
    );
    console.log("dataPushArray:", dataPushArray);
  };

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
          <div className={classes.paper} style={{ width: 600 }}>
            <h1 className={styles.modalTitle}>Return Values</h1>
            <Grid container spacing={3}>
              {checkLists.map((item, index) => {
                index = index + 1;
                return (
                  <Grid item xs={6}>
                    <label htmlFor={`id_${index}`} key={`key_${index}`}>
                      <CheckBox
                        id={`id_${index}`}
                        value={item}
                        onChange={handleChange}
                        checked={checkedItems[item.id]}
                        title={item}
                      />
                    </label>
                  </Grid>
                );
              })}
            </Grid>
            <div style={{ textAlign: "center", paddingTop: 10 }}>
              <button
                className={styles.primaryBtn}
                onClick={saveDataBtn}
                onClick={handleClose}
              >
                Save
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
