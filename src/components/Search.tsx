import { Button, Card, Chip, Input, InputBase, makeStyles, Paper, TextField } from "@material-ui/core"
import { Search as SearchIcon } from '@material-ui/icons'
import { useTheme } from '@material-ui/core'
import { useContext, useReducer, useState, useCallback } from "react"
import { FeedContext } from "../contexts/FeedContext"
import { fetchFeed } from "../helpers/API"

const useStyles = makeStyles((theme) => ({
  Search__Card: {
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
  },
  Search__Input: {
    padding: '1rem',
  },
  Search__Selected__Container: {
    marginLeft: '0.5rem',
    display: 'inline-flex',

  },
  Search__Selected: {
    '& + $Search__Selected': {
      marginLeft: '0.25rem'
    }
  }
}))

type SearchProps = {
  className?: string;
  elevation?: number;
}

function Search ({ className, elevation }: SearchProps) {
  const styles = useStyles()
  const [inputValue, setInputValue] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [contextData, dispatcher] = useContext(FeedContext)

  const setLoading = useCallback((isLoading: boolean) => {
    dispatcher({ type: 'UPDATE_LOADING_STATE', payload:isLoading })
  }, [])

  function handleKeyDown (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      const newSelected = [...selected]
      const value = event.currentTarget.value.trim()
      if (!value.replace(/\s/g, '').length) return

      const isDuplicate = newSelected.indexOf(value) !== -1
      if (isDuplicate) {
        setInputValue('')
        return
      }
      
      newSelected.push(value)
      setSelected(newSelected)
      setInputValue('')
      event.preventDefault()
      return
    }

    if (selected.length && !inputValue.length && event.key === 'Backspace') {
      setSelected(selected.slice(0, selected.length - 1))
    }
  }

  function handleChange (event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
  }

  function handleChipDelete (value: string) {
    const newSelected = [...selected]
    newSelected.splice(newSelected.indexOf(value), 1)
    setSelected(newSelected)
  }

  function handleSearch () {
    setLoading(true)
    fetchFeed({
      tags: selected.join(','),
      per_page: contextData.data.perPage
    }).then(({ id, result }) => {
      dispatcher({ type: 'UPDATE_ID', payload: id })
      dispatcher({ type: 'UPDATE_IMAGE_DATA', payload: result })
    }).catch(console.error)
    .finally(() => setLoading(false))
  }

  return (
    <Card classes={{ root: [styles.Search__Card, className].join(' ') }} elevation={elevation || 0}>
      <InputBase placeholder='Tag Search... (use "," or "Enter" to save tags)' classes={{ input: styles.Search__Input }} fullWidth value={inputValue} onKeyDown={handleKeyDown} onChange={handleChange}
      startAdornment={(
          <>
            <SearchIcon color='primary'/>
            { Boolean(selected.length) && <span className={styles.Search__Selected__Container}>
              { selected.map((chip, index) => (<Chip classes={{ root: styles.Search__Selected }} key={index} tabIndex={-1} label={chip} onDelete={() => handleChipDelete(chip)}/>)) }
            </span>}
          </>
        )}
      endAdornment={(<Button onClick={handleSearch} size="small" color="primary">Search</Button>)}
      />
    </Card>
  )
}

export default Search