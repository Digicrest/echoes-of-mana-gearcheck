import { Button } from '@mui/material';
import React, { Fragment } from 'react'
import '../stylesheets/StatEntry.css';

function StatEntry() {
  return (
      <Fragment>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <Button variant="contained">Hello world</Button>
      </Fragment>
  )
}

export default StatEntry