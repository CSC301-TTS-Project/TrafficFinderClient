import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class RangeSelect extends Component {
  constructor(props) {
    super(props);
  }

  handleStartValInputChange = (e) => {
    const {onStartValChange} = this.props
    onStartValChange(e.target.value)
  }


  handleEndValInputChange = (e) => {
    const {onEndValChange} = this.props
    onEndValChange(e.target.value)
  }



  render() {
    const { title, startVal, endVal, upperBoundInclusive } = this.props;

    return (
      <div>
        <h4 className={styles.menuTitle}>{title}</h4>
        <div style={{display: 'flex', justifyContent:'center'}}>
          <input 
            type="text" 
            value={startVal} 
            className={styles.rangeInput}  
            onChange={this.handleStartValInputChange}
          />
          <span className={styles.textRange}>
          {}
          {upperBoundInclusive? 'to (including)': 'to (excluding)'}
          </span>
          <input 
            type="text" 
            value={endVal} 
            className={styles.rangeInput}  
            onChange={this.handleEndValInputChange}
          />
        </div>
      </div>
    );
  }
}
