import React, {useState, useEffect} from "react";
import axios from 'axios'
import styles from './App.module.css'

function App() {
    const [term, setTerm] = useState('');
    const [debounceSearch, setDebounceSearch] = useState(term);
    const [results, setResults] = useState([]);

    useEffect(() => {
      const timeOut = setTimeout(() => setDebounceSearch(term), 1000);
      return () => clearTimeout(timeOut);
    }, [term])
    
    useEffect(() => { 
      const search = async () => {
        const respond = await axios.get('https://en.wikipedia.org/w/api.php', {
          params: {
            action   : 'query',
            list     : 'search',
            origin   : '*',
            format   : 'json',
            srsearch : debounceSearch,
          }
        })
        setResults(respond.data.query.search);
      }

      if (debounceSearch) search();
      
      return () => setResults([]);
    }, [debounceSearch])

    const fetchResults = results.map((el, idx) => {
        return (
          <tr key={el.pageid}>
            <th scope='row'>{idx + 1}</th>
            <td>{el.title}</td>
            <td> <span dangerouslySetInnerHTML={{"__html": el.snippet}} /></td>
          </tr>
        )
    })
  
  return (
    <div className='container'>
      <h1 className='text-center'>Wikipedia The Free Encyclopedia</h1><br/>
      <div className='row'>
        <div className='col'>
          <div className='my-3'>
            <label htmlFor='exampleFormControlInput1' className='form-label'>
              Search Input
            </label>
            <input
              type='text'
              className='form-control'
              id='exampleFormControlInput1'
              value={term}
              onChange={(e) => { setTerm(e.target.value) }}
            />
          </div>
        </div>
      </div>
      
      <div className={term.length? styles.inputEmpty : styles.inputFullOf}>
        <span className={styles.center}>XXX</span>
      </div>

      <div className={term.length !== 0? styles.inputFullOf : styles.inputEmpty}>
        <div className='row'>
          <div className='col'>
            <table className='table'>
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>Title</th>
                  <th scope='col'>Desc</th>
                </tr>
              </thead>
              <tbody>
                {fetchResults}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
