import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import styles from "./Menu.module.css";

const checkLists = [
  "Min travel time",
  "Max travel time",
  "Number of days",
  "Average travel time",
  "Median speed",
  "85th percentile",
  "95th percentile",
  "Standard Deviation",
  "Sample Count Observations &  complete coverage",
];

const CheckBox = ({id, value, checked, onChange, title}) => {
  return (
    <div>
      <input
        id={id}
        type="checkbox"
        name="inputNames"
        checked={checked}
        onChange={onChange}
        value={value}
      />
      {title}
    </div>
  )
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleChange = e => {
    setCheckedItems({
      ...checkedItems,
      [e.target.id]: e.target.checked
    });
    console.log('checkedItems:', checkedItems)
  };

  const saveDataBtn = e => {
    e.preventDefault();
    const dataPushArray = Object.entries(checkedItems).reduce((pre,[key, value])=>{
      value && pre.push(key)
      return pre
    },[]);
    console.log("dataPushArray:", dataPushArray)
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
          Download Data as CSV
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
            <div className={classes.paper} style={{maxWidth: 500}}>
              <h3 style={{textAlign: 'center'}}>Return Values</h3>
              {checkLists.map((item, index) => {
                index = index + 1
                return (
                  <label htmlFor={`id_${index}`} key={`key_${index}`} style={{padding: 10}}>
                    <CheckBox
                      id={`id_${index}`}
                      value={item}
                      onChange={handleChange}
                      checked={checkedItems[item.id]}
                      title={item}
                    />
                  </label>
                )
              })}
              <div style={{textAlign: "center", paddingTop: 10}}>
                <button onClick={saveDataBtn} style={{background: "#9A21F9", color:'white', width: 150}}> send data </button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
  );
}
