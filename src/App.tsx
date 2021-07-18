import { CircularProgress, makeStyles, TablePagination, Typography, useScrollTrigger } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import Search from './components/Search';
import Feeds from './containers/Feeds';
import FeedContextProvider, { FeedContext } from './contexts/FeedContext';
import { fetchFeed } from './helpers/API';

const useStyles = makeStyles((theme) => ({
  App: {
    
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
    width: 'auto'
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40rem'
  }
}))

function App() {
  const styles = useStyles()
  const [list, setList] = useState<API.Feed.FeedItem[]>([])
  const [page, setPage] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [isSearchFixed, setSearchFixed] = useState(false)
  const [rowPerPage, setRowPerPage] = useState(10)
  const requestId = useRef<string>('')
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  function handlePageChange (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) {
    setPage(page)
  }

  function handleRowsPerPageChange (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null) {
    setRowPerPage(parseInt(event?.target.value || '10', 10))

    setPage(0)
  }

  useEffect(() => {
    async function feedFetcher() {
      try {
        setLoading(true)
        const { id, result } = await fetchFeed({ page: page + 1,  per_page: rowPerPage})
        requestId.current = id
        setList(result.data)
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
    <FeedContextProvider value={{ images: list, loading: isLoading }}>
      <FeedContext.Consumer>
        {([ contextData ]) => (
        <div className={styles.App}>
          <div ref={searchWrapperRef} className={styles.Search__Wrapper}>
            <Search className={[styles.Search, isSearchFixed && styles.Search__Fixed].join(' ')} elevation={isSearchFixed ? 4 : 0}/>
          </div>
          {
            !contextData.loading && contextData.images.length ?
            <>
              <Feeds items={contextData.images}/>

              <div className={styles.Pagination__Wrapper}>
                <TablePagination component="div" count={list.length || 0} page={page} rowsPerPage={rowPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} rowsPerPageOptions={[5, 10, 20]}/>
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
        )}
      </FeedContext.Consumer>
    </FeedContextProvider>
  );
}

export default App;
