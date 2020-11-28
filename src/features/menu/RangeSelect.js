import React, { Component } from "react";
import styles from "./Menu.module.css";
export default class RangeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStartVal: undefined
    };
  }

  handleInputChange = (e) => {
    this.setState({
      newStartVal: e.target.value
    });
}

  render() {
    const { title, startVal, endVal } = this.props;

    

    return (
      <div>
        <h4 className={styles.menuTitle}>{title}</h4>
        <input type="text" value={this.state.newStartVal === undefined? startVal : this.state.newStartVal} className={styles.rangeInput}  onChange={this.handleInputChange}/>
        <span className={styles.textRange}>to</span>
        <input type="text" value={endVal} className={styles.rangeInput} />
      </div>
    );
  }
}
