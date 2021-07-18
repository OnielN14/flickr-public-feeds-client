import { makeStyles, TablePagination } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FeedItemType } from './components/FeedItem';
import Search from './components/Search';
import Feeds from './containers/Feeds';
import FeedContextProvider, { FeedContext } from './contexts/FeedContext';

const useStyles = makeStyles((theme) => ({
  App: {
    
  },
  Search: {
    width: '40rem',
    margin: '0 auto'
  },
  Search__Wrapper: {
    zIndex: 1,
    padding: '1rem 0px'
  },
  Feeds__Wrapper: {
    padding: '1rem'
  },
  Pagination__Wrapper: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

function App() {
  const styles = useStyles()
  const [list, setList] = useState<FeedItemType[]>([])
  const [page, setPage] = useState(0)
  const [rowPerPage, setRowPerPage] = useState(10)

  function handlePageChange (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) {
    setPage(page)
  }

  function handleRowsPerPageChange (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null) {
    setRowPerPage(parseInt(event?.target.value || '10', 10))

    setPage(0)
  }

  useEffect(() => {
    setList([])
  }, [])

  return (
    <FeedContextProvider value={{ images: list }}>
      <FeedContext.Consumer>
        {([ contextData ]) => (
        <div className={styles.App}>
          <div className={styles.Search__Wrapper}>
            <Search className={styles.Search}/>
          </div>
          
          <Feeds items={contextData.images}/>

          <div className={styles.Pagination__Wrapper}>
            <TablePagination component="div" count={list.length || 0} page={page} rowsPerPage={rowPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} rowsPerPageOptions={[5, 10, 20]}/>
          </div>
        </div>
        )}
      </FeedContext.Consumer>
    </FeedContextProvider>
  );
}

export default App;
