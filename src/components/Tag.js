const Tag = ({ onToggle, isSelected, onAddTag, onDeleteTag, allTag }) => {
  const addTagButton = () => {
    if (isSelected.includes(allTag) === false) {onToggle(allTag); onAddTag(allTag)}
  }

  return (
    <div key={allTag} className="control">
      <div className={"tags" + (isSelected.includes(allTag) ? ' has-addons' : '')}>
        <button id={allTag} className={"tag is-rounded" + (isSelected.includes(allTag) ? ' is-info is-default' : '')} onClick={() => {addTagButton()}}>{allTag}</button>
        <button id={allTag} className={"tag is-delete is-rounded" + (isSelected.includes(allTag) ? '' : ' is-hidden')} onClick={() => { onDeleteTag(allTag); onToggle(allTag);}}></button>
      </div>
    </div>
  )
}

export default Tag
