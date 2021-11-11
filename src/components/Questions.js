import Question from './Question';

const Questions = ({ searchTerm, isSelected, questionsState, currentTags }) => {
  return (
    <>
      <h2 className="subtitle mt-5 mb-0">{questionsState.length > 0 ? "" : "Keine Ergebnisse."}</h2>
      {questionsState.filter(question => currentTags.some(tag => question.tag.includes(tag))).map(question =>
        (<Question searchTerm={searchTerm} isSelected={isSelected} key={question.id} question={question} />)
      )}
    </>
  )
}

export default Questions
