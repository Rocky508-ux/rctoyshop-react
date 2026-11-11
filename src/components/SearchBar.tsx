import { useState } from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

interface SearchBarProps {
  /** 按下搜尋或 Enter 時呼叫，把輸入框的字傳出去。要做什麼由父層決定 */
  onSearch: (query: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ width: '100%', maxWidth: 600, alignItems: 'center' }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="搜尋產品..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <Button variant="contained" onClick={handleSearch}>
        搜尋
      </Button>
    </Stack>
  )
}

export default SearchBar
