import { Card, Chip, Input, InputBase, makeStyles, Paper, TextField } from "@material-ui/core"
import { Search as SearchIcon } from '@material-ui/icons'
import { useTheme } from '@material-ui/core'
import { useState } from "react"

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

  function handelChipDelete (value: string) {
    const newSelected = [...selected]
    setSelected(newSelected.splice(newSelected.indexOf(value), 1))
  }

  return (
    <Card classes={{ root: [styles.Search__Card, className].join(' ') }} elevation={elevation || 0}>
      <InputBase placeholder='Tag Search... (use "," or "Enter" to save tags)' classes={{ input: styles.Search__Input }} fullWidth startAdornment={(
        <>
          <SearchIcon color='primary'/>
          { Boolean(selected.length) && <span className={styles.Search__Selected__Container}>
            { selected.map((chip, index) => (<Chip classes={{ root: styles.Search__Selected }} key={index} tabIndex={-1} label={chip} onDelete={() => handelChipDelete(chip)}/>)) }
          </span>}
        </>
      )} value={inputValue} onKeyDown={handleKeyDown} onChange={handleChange}/>
    </Card>
  )
}

export default Search