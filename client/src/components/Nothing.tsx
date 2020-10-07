import React, {Component } from 'react'

class Nothing extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
          <div>
            this is the Nothing component route.  you are Nowhere.
          </div>
        );
    }
}

export default Nothing;