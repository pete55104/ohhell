import React, {FC, useEffect } from 'react'
import { NavLink } from 'react-router-dom';

const SatiatedBear: FC<{}> = () => {
    useEffect(() => {
      document.body.style.backgroundColor = "black";
      return () => {
        document.body.style.backgroundColor = "lightgray";
      }
    })

    return (
    <div className="centeringdiv darkmode">
        <h1>you have been eaten by a bear</h1>
      <div>
        <NavLink activeClassName="active" exact to="/">out</NavLink>
      </div>
      </div>
    );
}

export default SatiatedBear;