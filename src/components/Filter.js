import Tag from './Tag'
import Search from './Search'

import { useState, useEffect } from 'react'

const Filter = ({ allTags, isSelected, setSelected, setCurrentTags, searchKeyword, term, onAddTag, isActive, toggleClass, onDeleteTag }) => {
  // toggles the check/uncheck button
  const [isChecked, setChecked] = useState(true);
  const toggleCheck = () => {
    setChecked(!isChecked);
  }

  const toggleSelectedTags = (clickedTag) => {
    setSelected(currentTags => {
      if(currentTags.includes(clickedTag)) {
        return currentTags.filter(tagToToggle => tagToToggle !== clickedTag);
      }
      return currentTags.concat(clickedTag)
    })
  }

  useEffect(() => {
    if (isChecked === true) {
      setSelected(allTags)
      setCurrentTags(allTags)
    } else{
      setSelected([])
      setCurrentTags([])
    }
  }, [isChecked]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
  <div className="mt-3 search-box is-flex is-justify-content-space-between">

    {/* Left side */}
    <div className="mobile-full level-left">
      <div className="mobile-full level-item">
        <Search searchKeyword={searchKeyword} term={term} />
      </div>
    </div>

    {/* Right Side */}
    <div id="tag-parent" className="level-right">
      <p className="level-item mr-0"><button onClick={toggleClass} className={"button" + (isActive ? ' is-light' : '')}>Nach Tags filtern</button></p>

      <div id="tag-box" className={"box" + (isActive ? '' : ' is-hidden')}>
        {/* Check/Uncheck button */}
        <button
          className={"mr-2 mb-4 button is-small is-fullwidth is-light" + (!isChecked ? "" : " is-info")}
          onClick={() => {toggleCheck()}}>
        {isChecked ? "Alle Tags entfernen" : "Alle Tags auswählen"}
        </button>
        {/* Tags box */}
        <div className="field is-grouped is-grouped-multiline">
          {allTags.map(allTag =>
            (<Tag onToggle={toggleSelectedTags} isSelected={isSelected} onAddTag={onAddTag} onDeleteTag={onDeleteTag} key={allTags.indexOf(allTag)} allTag={allTag} />)
          )}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Filter
