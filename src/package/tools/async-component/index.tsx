// @ts-nocheck
import React, { Component } from 'react';

type MyProps = { };
type MyState = { component: typeof React.Component };

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component<MyProps, MyState> {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component,
      });
    }

    render() {
      // eslint-disable-next-line react/destructuring-assignment
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}

export type AsyncType = asyncComponent<T>;
