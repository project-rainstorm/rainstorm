import React from "react";
import PropTypes from "prop-types";
import style from "./style.css";
import classnames from 'classnames';

export default class Tabs extends React.Component {
  static propTypes = {
    tabList: PropTypes.array
  };

  state = {
    activeTab: this.props.tabList[0].name
  };

  render() {
    const Content = this.props.tabList.find(
      tab => tab.name === this.state.activeTab
    ).content;

    return (
      <div>
        <ul className={style.tabs}>
          {this.props.tabList.map(tab => (
            <li
              className={classnames( style.tabItem, tab.name === this.state.activeTab && style.active)}
              rel={tab.name}
              onClick={() => this.setState({ activeTab: tab.name })}
            >
              {tab.label}
            </li>
          ))}
        </ul>
        <div className={style.tabContainer}>
          <div className={style.tabContent}>
            <Content />
          </div>
        </div>
      </div>
    );
  }
}
