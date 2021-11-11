import uniqid from 'uniqid';
import Highlighter from "react-highlight-words";

const Question = ({ searchTerm, isSelected, question }) => {
  return (
    <div>
      <div className="card p-5 mt-4" key={question.id}>
        <div className="message">
          <Highlighter className="mb-0 message-header title is-6"
            highlightClassName="highlighted has-background-light p-1"
            searchWords={searchTerm.toLowerCase().split(' ')}
            autoEscape={true}
            textToHighlight={question.question}
          />
          <div className="message-body" dangerouslySetInnerHTML={{ __html: question.answer.html }}></div>
        </div>
        <div className="tags">
          {question.tag.map(x =>
            (<span key={uniqid()} className={"tag is-small" + (isSelected.includes(x) ? ' is-info' : '')}>{x}</span>)
          )}
        </div>
      </div>
    </div>
  )
}

export default Question
