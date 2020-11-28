import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class RangeSelect extends Component {
  constructor(props) {
    super(props);
  }

  handleInputChange = (e) => {
    const {onStartValChange} = this.props
    onStartValChange(e.target.value)
}

  render() {
    const { title, startVal, endVal } = this.props;

    return (
      <div>
        <h4 className={styles.menuTitle}>{title}</h4>
        <input 
          type="text" 
          value={startVal} 
          className={styles.rangeInput}  
          onChange={this.handleInputChange}
        />
        <span className={styles.textRange}>to</span>
        <input 
          type="text" 
          value={endVal} 
          className={styles.rangeInput}  
          // onChange={this.handleInputChange}
        />
      </div>
    );
  }
}
