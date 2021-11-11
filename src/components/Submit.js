import loading from '../assets/loading.svg';

import {useState, useEffect, useRef} from 'react';

import BaseSelect from 'react-select';
import FixRequiredSelect from "./FixRequiredSelect";
import {loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha} from 'react-simple-captcha';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSpring, animated} from 'react-spring';

const Submit = ({askIsActive, toggleAsk, allTagsSelect}) => {
  // replaces react-select with the fixed one
  const Select = props => (<FixRequiredSelect
    {...props}
    SelectComponent={BaseSelect}
    options={allTagsSelect}/>);

  const refCaptcha = useRef(null);

  // animate submit box
  const props = useSpring({
    opacity: askIsActive
      ? 1
      : 0
  })

  const [isLoading,
    setLoading] = useState(false);

  const [sent,
    setSent] = useState(false);

  //connects google spreadsheet and posts the data from form
  useEffect(() => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx3u6GaG4bg6-fTL3mmjuGG7UJBAOFCHEiEPZm2X' +
        'rUAGIbXvi0WwZ_sFtpthUv4Z3-7bw/exec'
    const form = document.forms['submit-to-google-sheet']

    loadCaptchaEnginge(4, 'white', 'black', 'numbers');

    form.addEventListener('submit', e => {
      setLoading(true);
      e.preventDefault();
      if (validateCaptcha(refCaptcha.current.value) === true) {
        fetch(scriptURL, {
          method: 'POST',
          body: new FormData(form)
        }).then(() => {
          setLoading(false);
          setSent(true);
        }).catch(error => console.error('Error!', error.message));
      } else {
        setLoading(false);
        toast.error('Captcha war nicht richtig.', {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined
        });
      }
    })
  }, [])

  useEffect(() => {
    if (sent) {
      toast.success('Erfolgreich abgeschickt.', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined
      });
      toggleAsk();
    }
    // eslint-disable-next-line
  }, [sent])

  return (
    <div>
      <animated.form
        style={props}
        name="submit-to-google-sheet"
        className={"box mt-3 mb-6 is-align-items-center is-flex-direction-column" + (askIsActive
        ? " is-flex"
        : " is-hidden")}>
        {!sent ? (
          <>
          <div  className={isLoading
        ? " is-hidden"
        : " is-block full"}>
          <div className="field">
            <label className="mb-0 label">Email</label>
            <p className="mt-0 mb-2 help">Du bekommst eine Email wenn deine Frage beantwortet wird</p>
            <div className="control">
              <input
                name="from"
                className="input"
                type="email"
                placeholder="beispiel@mail.com"
                required/>
            </div>
          </div>

          <div className="field">
            <label className="label">Deine Frage</label>
            <div className="control">
              <input
                name="question"
                className="input"
                type="text"
                placeholder="Wie sieht es aus mit..."
                required/>
            </div>
          </div>

          <div className="field">
            <label className="label">Kategorie(n)</label>
            <div className="control">
              <Select
                name="tags"
                className="basic-multi-select"
                isMulti
                options={allTagsSelect}
                theme={(theme) => ({
                ...theme,
                borderRadius: 4,
                borderColor: '#dbdbdb',
                colors: {
                  ...theme.colors,
                  primary25: '#f0f5fb',
                  primary: '#aaa'
                }
              })}
                required
                delimiter=" | "/>
            </div>
          </div>

          <div className="field">
            <div className="captcha">
              <label className="label">Captcha</label>
              <LoadCanvasTemplate reloadColor="#aaa" reloadText="Neu generieren"/>
            </div>
            <div className="control">
              <input ref={refCaptcha} className="input" type="text" required/>
            </div>
          </div>

          <button type="submit" className="button is-link">Senden</button>
        </div>
        <div className={"loading mt-3 is-align-items-center"+ (isLoading
            ? " is-flex"
            : " is-hidden")}>
          <object
            type="image/svg+xml"
            data={loading}>svg-animation</object>
          <h2 className="ml-3 is-3">Wird versendet...</h2>
        </div>
        </>
        ) : (
          <article class="full message is-warning">
            <div class="message-header">
              <p>Nur eine Frage pro Tag</p>
            </div>
            <div class="message-body">
              Du kannst immer nur eien Frage pro Tag stellen. Gerne kannst du morgen wieder kommen.
            </div>
          </article>
        )}
      </animated.form>
      <ToastContainer/>
    </div>
  )
}

export default Submit
