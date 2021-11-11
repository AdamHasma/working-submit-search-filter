import { useRef } from 'react'

const Search = ({ searchKeyword, term }) => {
  const inputEl = useRef('');

  const getSearchTerm = () => {
    searchKeyword(inputEl.current.value)
  }

  return (
    <div className="mobile-full field has-addons">
      <p className="control">
        <input ref={inputEl} className="input" type="text" placeholder="Suche nach einer Frage" value={term} onChange={getSearchTerm}/>
      </p>
      <p className="control">
        <button className="button">
          Suchen
        </button>
      </p>
    </div>
  )
}

export default Search
