import React from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import classnames from 'classnames';

export default class FlexTable extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    columns: PropTypes.array,
  }

  state = {

  }

  render() {
    return <div className={style.divTable}>
    <div className={style.body}>
    <div className={style.row}>
      {this.props.columns.map(col => (
        <div className={classnames(style.cell, style.colHeader)}>
            {col.label}
        </div>)
      )}
      </div>
      {this.props.data.map(row => (
        <div className={style.row}>
            {this.props.columns.map(col =>(
                <div className={style.cell}>
                    {col.render ? col.render(row[col.name], row) : row[col.name]}
                </div>)
            )}
        </div>
      ))
    }
    </div>
    </div>;
  }
}
