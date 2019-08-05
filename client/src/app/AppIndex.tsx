import React from 'react';
import {Link} from "react-router-dom";

const AppIndex = () => {
  return <div>
    <h1>Design your own packaging</h1>
    <div>Select size</div>
    <Link to="/design" className="btn btn-primary">Customize</Link>
  </div>
}

export default AppIndex