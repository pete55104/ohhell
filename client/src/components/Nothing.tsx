import React, {Component } from 'react'

class Nothing extends Component<{}, {}> {
    render() {
        return (
          <div className="centeringdiv">
            <h1>nada</h1>
            <span>this is the nothing component route.  you are nowhere.</span>
          </div>
        );
    }
}

export default Nothing;