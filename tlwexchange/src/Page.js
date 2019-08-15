import React from 'react';
import { drizzleConnect } from 'drizzle-react'

class PageContrainer extends React.Component {
    constructor(props){
        super(props)
        console.log('props', props)
        let TlwToken = props.TlwToken
        TlwToken.getBalances().then((result) => console.log(result))
    }
    render() {
      return (
          <div>Page xxxx</div>
      )
    }
  }

const mapStateToProps = state => {
    console.log('state', state)
  return {
    web3: state.web3,
    drizzleStatus: state.drizzleStatus,
    TlwToken: state.contracts.TlwToken
  }
}

const Page = drizzleConnect(PageContrainer, mapStateToProps);
export default Page