import { CircularProgress, makeStyles, TablePagination, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import Search from './components/Search';
import Feeds from './containers/Feeds';
import FeedContextProvider, { FeedContext } from './contexts/FeedContext';
import { FeedResultResponse, fetchFeed } from './helpers/API';

const useStyles = makeStyles((theme) => ({
  App: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto',
    minHeight: '100vh'
  },
  Search: {
    width: '40rem',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      '&:not($Search__Fixed)': {
        width: '100%',
      }
    },
  },
  Search__Fixed: {
    position: 'fixed',
    zIndex: 10,
    left: '1rem',
    right: '1rem',
    [theme.breakpoints.down('md')]: {
      width: 'auto',
    },
  },
  Search__Wrapper: {
    zIndex: 1,
    padding: '1rem 0px',
    [theme.breakpoints.down('md')]: {
      padding: '1rem'
    }
  },
  Feeds__Wrapper: {
    padding: '1rem'
  },
  Pagination__Wrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  Message__Wrapper: {
    gridRow: '2 span 3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
}))

function App() {
  const styles = useStyles()
  const [list, setList] = useState<FeedResultResponse>({
    data: [],
    page: 0,
    perPage: 0,
    total: 0,
    totalPage: 0})
  const [page, setPage] = useState(0)
  const [isLoading, setLoading] = useState(true)
  const [isSearchFixed, setSearchFixed] = useState(false)
  const [rowPerPage, setRowPerPage] = useState(9)
  const requestId = useRef('')
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  function handlePageChange (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) {
    setLoading(true)
    fetchFeed({ request_id: requestId.current || '', page: page + 1, per_page: rowPerPage })
      .then(({ id, result }) => {
        setList(result)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  function handleRowsPerPageChange (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null) {
    const _rowPerPage = parseInt(event?.target.value || '9', 10)
    setRowPerPage(_rowPerPage)

    setLoading(true)
    fetchFeed({ request_id: requestId.current || '', per_page: _rowPerPage })
      .then(({ id, result }) => {
        setList(result)
        setPage(0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    async function feedFetcher() {
      try {
        setLoading(true)
        const { id, result } = await fetchFeed({ page: page + 1,  per_page: rowPerPage})
        requestId.current = id
        setList(result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    feedFetcher()

    const searchWrapperObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio < 1) {
          setSearchFixed(true)
        } else {
          setSearchFixed(false)
        }
      })
    }, {
      threshold: 1
    })
    if (searchWrapperRef.current) {
      searchWrapperRef.current.style.height = `${searchWrapperRef.current.offsetHeight}px`
      searchWrapperObserver.observe(searchWrapperRef.current)
    }
  }, [])

  return (
    <FeedContextProvider value={{ data: list, loading: isLoading, id: requestId.current }}>
      <FeedContext.Consumer>
        {([ contextData ]) => {
          if (contextData.id) requestId.current = contextData.id

          return (
            <div className={styles.App}>
              <div ref={searchWrapperRef} className={styles.Search__Wrapper}>
                <Search className={[styles.Search, isSearchFixed && styles.Search__Fixed].join(' ')} elevation={isSearchFixed ? 4 : 0}/>
              </div>
              {
                !contextData.loading && contextData.data.data.length ?
                <>
                  <Feeds items={contextData.data.data}/>
    
                  <div className={styles.Pagination__Wrapper}>
                    <TablePagination component="div" count={contextData.data.total || 0} page={contextData.data.page - 1} rowsPerPage={contextData.data.perPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} rowsPerPageOptions={[3, 6, 9, 12, 15, 18]}/>
                  </div>
                </>
                :
                contextData.loading ?
                <div className={styles.Message__Wrapper}>
                  <CircularProgress color="primary"/>
                </div>
                :
                <div className={styles.Message__Wrapper}>
                  <Typography>There is no data</Typography>
                </div>
              }
            </div>
            )
        }}
      </FeedContext.Consumer>
    </FeedContextProvider>
  );
}

export default App;
