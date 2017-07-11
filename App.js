import React, { Component } from 'react'
import { Provider } from 'react-redux';
import configureStore from './Redux/configureStore';
import AppPanel from './Components/Containers/AppPanel';

const store = configureStore();

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <AppPanel />
      </Provider>
    )
  }
}
