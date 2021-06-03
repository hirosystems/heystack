import ReactDOM from 'react-dom';
import { Provider } from 'jotai';
import './index.css';
import App from './components/app';

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('app')
);
