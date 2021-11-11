import Questions from './components/Questions';
import Filter from './components/Filter';
import Submit from './components/Submit';
import loading from './assets/loading.svg';

import {request} from 'graphql-request';

import {useState, useEffect} from 'react'

const App = () => {
  // Every tag that exists
  const [allTags,
    setAllTags] = useState([]);

  // for the Select Component
  const [allTagsSelect,
    setAllTagsSelect] = useState([]);

  // current used tags
  const [currentTags,
    setCurrentTags] = useState([]);

  // selected Tags from Fitler.js -> Tag.js
  const [isSelected,
    setSelected] = useState(allTags);

  const [questionsState,
    setQuestionsState] = useState([]);

  // Search box
  const [searchTerm,
    setSearchTerm] = useState('');
  const [searchResults,
    setSearchResults] = useState([]);
  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm)

    // Uses the new question array if something is typed in the search bar, else
    // replace it with the questionsState
    if (searchTerm !== '') {
      const newQuestionsList = questionsState.filter(q => searchTerm.toLowerCase().split(' ').some(term => q.question.toLowerCase().includes(term)));

      setSearchResults(newQuestionsList);
    } else {
      setSearchResults(questionsState);
    }
  }

  // data
  const [isLoaded,
    setLoaded] = useState(false)

  // for toggling the tags box in Filter.js
  const [isActive,
    setActive] = useState(false);
  const toggleClass = () => {
    setActive(!isActive);
  };

  // for toggling Frage einreichen
  const [askIsActive,
    setAskActive] = useState(false);
  const toggleAsk = () => {
    setAskActive(!askIsActive);
  };

  // deletes clicked tag from currentTags
  const deleteTag = (clickedTag) => {
    setCurrentTags(currentTags.filter((currentTag) => currentTag !== clickedTag))
  }
  // adds clicked tag to currentTags
  const addTag = (clickedTag) => {
    setCurrentTags([
      ...currentTags,
      clickedTag
    ]);
  }

  //Graph CMS
  const [posts,
    setPosts] = useState([]);

  const postsQuery = `
    {
      posts {
        id
        question
        answer {
          html
        }
        tag
        author
      }
      __type(name: "Tags") {
        enumValues {
          name
        }
      }
    }`

  useEffect(() => {
    const fetchPosts = async() => {
      await request('https://api-eu-central-1.graphcms.com/v2/ckur5iobk001y01xm6ftlaiya/master', postsQuery).then(data => setPosts(data));
    };
    fetchPosts();

  }, [postsQuery])

  useEffect(() => {
    // if posts is fetched to state reconstructor them and replace the "_" on all
    // tags on posts and tags
    if (Object.keys(posts).length) {
      setAllTags(posts.__type.enumValues.map(value => {
        return value
          .name
          .replaceAll('_', ' ');
      }));
      setQuestionsState(posts.posts.map(post => ({
        ...post,
        tag: post
          .tag
          .map(t => t.replaceAll('_', ' '))
      })))
    }
  }, [posts])

  useEffect(() => {
    if (allTags.length > 0) {
      setCurrentTags(allTags);
      // react-select needs this pattern of objects
      setAllTagsSelect(allTags.map(allTag => {
        return {'value': allTag, 'label': allTag}
      }));

      setLoaded(true);
    }
  }, [allTags])

  return (
    <div className="container is-max-desktop mt-6 mb-6">
      {isLoaded === false
        ? (
          <object type="image/svg+xml" data={loading}>svg-animation</object>
        )
        : (
          <div>
            <div className="is-align-items-center is-flex is-justify-content-space-between">
              <div className="logo">
                <h1 className="title is-1 mb-0">FAW</h1>
                <p className="mt-0 help">Fragen an die Wissenden</p>
              </div>
              <button
                onClick={() => toggleAsk()}
                className={"button is-link" + (askIsActive
                ? " is-light"
                : "")}>Frage einreichen</button>
            </div>

            <div id="submit-box">
              <Submit
                askIsActive={askIsActive}
                toggleAsk={toggleAsk}
                allTagsSelect={allTagsSelect}/>
            </div>

            <Filter
              allTags={allTags}
              isSelected={isSelected}
              setSelected={setSelected}
              setCurrentTags={setCurrentTags}
              term={searchTerm}
              searchKeyword={searchHandler}
              onAddTag={addTag}
              onDeleteTag={deleteTag}
              currentTags={currentTags}
              isActive={isActive}
              toggleClass={toggleClass}/>

            <Questions
              searchTerm={searchTerm}
              isSelected={isSelected}
              questionsState={searchTerm.length < 1
              ? questionsState
              : searchResults}
              currentTags={currentTags}/>
          </div>
        )}
    </div>
  );
}

export default App;
