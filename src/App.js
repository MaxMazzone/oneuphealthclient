import  React, { useState, useCallback }from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './App.css';

function App() {
  const [result, setResult] = useState([]);
  const [skip, setSkip] = useState(0);
  const [maximum, setMaximum] = useState(true);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');


  const fetchData = useCallback(async (newSkip) => {
    setLoading(true)
    setSkip(newSkip)

    let response;
    try {
      response = await axios({
        url: `https://oneupapi.herokuapp.com/fhir/everything/${accessToken}`,
        params:{ skip: newSkip }
        }
      );
      setResult(response.data.resources)
      setMaximum(response.data.total)
      setLoading(false)
    } catch (error) {
      window.alert(`Server returned error: ${error.response.data.error_description}. AccessToken is not validated and must be exact match`)
    }
  }, [accessToken]);

  const reset = () => {
    setLoading(true)
    setSkip(0)
    setMaximum(true)
    setAccessToken('')
    setResult([])
    setLoading(false)
  }

  const useStyles = makeStyles({
    center: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

    },
    table: {
      flex: 1,
      maxWidth: 800,
    },
    tableInactive: {
      flex: 1,
      maxWidth: 800,
      opacity: '.3'
    },
    buttonContainer: {
      padding: 20
    },
    button: {
      padding: 20,
      margin: 20
    },
    submitButton: {
      marginLeft: 10
    },
    inactiveSubmit: {
      display: 'none'
    },
    
  });
  const classes = useStyles();

  return (
    <div className="App">
      <div className={classes.center}>
        <div className={result.length > 0 ? classes.inactiveSubmit : null}>
          <h2>Welcome</h2>
          <h4>Please enter a valid access code</h4>
          <input required type="text" onChange={(e)=> setAccessToken(e.target.value)} name='accessToken' value={accessToken}/>
          <button className={classes.submitButton} disabled={accessToken === ''} onClick={()=> fetchData(0)}> Submit </button>
        </div>
        {((result.length !== 0) && accessToken !== '') &&
        <div>
          <h3>Record {skip} - {skip + 10 < maximum ? skip + 10 : maximum} of {maximum}</h3>
          <div className={classes.buttonContainer}>
            <button className={classes.button} disabled={loading||skip < 10} type="button" onClick={() => fetchData(skip - 10)}>
              - 10
            </button>
            <button className={classes.button} disabled={loading||skip > maximum -10} type="button" onClick={() => fetchData(skip + 10)}>
              + 10
            </button>
            <button className={classes.button} disabled={loading} type="button" onClick={() => reset()}>
              reset
            </button>
          </div>
          <TableContainer component={Paper}>
            <Table className={!loading ? classes.table: classes.tableInactive} aria-label="simple table">
              <TableBody>
                {result.map((row) => {
                  let cells = []
                  for(var key in row){
                    cells.push(<TableCell key={uuidv4()} align="right">{`${key}: ${row[key]}`}</TableCell>)
                  }
                  return <TableRow key={uuidv4()}>{cells}</TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>}
      </div>
    </div>
  );
}

export default App;
