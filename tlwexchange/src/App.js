import React from 'react';
import logo from './logo.svg';
import './App.css';
import TlwToken from './module/TlwToken'
import History from './History'
import TransactionSell from './TransactionSell'


function SectionHeader(props) {
  let { pageName, reservePay } = props
  return (
    <section className="content-header">
      <h1>
        {pageName}
        <small>Preview</small>
        <i style={{paddingLeft:10}} className="fa fa-money"> : {reservePay} ether</i>
      </h1>
      <ol className="breadcrumb">
        <li><a href="/"><i className="fa fa-dashboard"></i> Home</a></li>
        <li className="active">{pageName}</li>
      </ol>
    </section>
  )
}

function Header() {
  return (
    <header className="main-header">
      <a href="/" className="logo">
        <span className="logo-mini"><b>A</b>LT</span>
        <span className="logo-lg"><b>Coin Exchange</b></span>
      </a>

      <nav className="navbar navbar-static-top">
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">
            <li className="dropdown user user-menu">
              <a href="/" className="dropdown-toggle" data-toggle="dropdown">
                <img src="dist/img/user2-160x160.jpg" className="user-image" alt="User" />
                <span className="hidden-xs">Alexander Pierce</span>
              </a>
              <ul className="dropdown-menu">
                <li className="user-header">
                  <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" />

                  <p>
                    Alexander Pierce - Web Developer
                  <small>Member since Nov. 2012</small>
                  </p>
                </li>
                <li className="user-body">
                  <div className="row">
                    <div className="col-xs-4 text-center">
                      <a href="/">Followers</a>
                    </div>
                    <div className="col-xs-4 text-center">
                      <a href="/">Sales</a>
                    </div>
                    <div className="col-xs-4 text-center">
                      <a href="/">Friends</a>
                    </div>
                  </div>
                </li>
                <li className="user-footer">
                  <div className="pull-left">
                    <a href="/" className="btn btn-default btn-flat">Profile</a>
                  </div>
                  <div className="pull-right">
                    <a href="/" className="btn btn-default btn-flat">Sign out</a>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>

      </nav>
    </header>
  )
}

function Aside() {
  return (
    <aside className="main-sidebar">
      <section className="sidebar" style={{ height: 'auto' }}>
        <div className="user-panel">
          <div className="pull-left image">
            <img src="dist/img/user2-160x160.jpg" className="img-circle" alt="User" />
          </div>
          <div className="pull-left info">
            <p>Alexander Pierce</p>
            <a href="/"><i className="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>

        <ul className="sidebar-menu tree" data-width="tree">
          <li><a href="/"><i className="fa fa-random"></i>
            <span>Transaction Buy Form</span></a>
          </li>
          <li><a href="/TransactionSell"><i className="fa fa-book"></i>
            <span>Transaction Sell Form</span></a>
          </li>
          <li><a href="/History"><i className="fa fa-area-chart"></i>
            <span>History</span></a>
          </li>
        </ul>

      </section>
    </aside>
  )
}

class App extends React.Component {

  state = {
    loading: true,
    drizzleState: null,
    tlwToken: null,
    price: 0,
    reservePay: 0,
    totalCoin: '',
    totalEth: '',
    buyStatus: 'Waiting',
    toAddress: '0x0'
  };

  componentDidMount() {
    const { drizzle } = this.props;

    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();

      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
        this.initState()
        drizzle.web3.currentProvider.publicConfigStore.on('update', async () => {
          let checkAccount = this.account
          TlwToken.init(drizzle.web3, drizzle.contracts.TlwToken).getAccount()
            .then(account => {
              if (checkAccount !== account) {
                this.initState()
              }
            })
        });
      }
    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }

  constructor(props) {
    super(props)
    this.tlwToken = null
    this.initState = this.initState.bind(this)
    this.handleBuyClick = this.handleBuyClick.bind(this)
    this.handleToAddressChange = this.handleToAddressChange.bind(this)
  }

  async initState() {
    const { drizzle } = this.props
    this.tlwToken = TlwToken.init(drizzle.web3, drizzle.contracts.TlwToken)
    this.account = await TlwToken.getAccount()


    console.log('web3', drizzle.web3)
    console.log('TlwToken', drizzle.contracts.TlwToken)

    console.log('acc', this.account)
    let price = await this.tlwToken.getPrice();
    price = drizzle.web3.utils.fromWei((price).toString(), 'ether')
    let reservePay = await this.tlwToken.getReservePay();
    reservePay = drizzle.web3.utils.fromWei((reservePay).toString(), 'ether')

    this.setState({
      price: price,
      reservePay: reservePay
    })
  }

  changeTotalCoinHandler = event => {
    let totalEth = event.target.value / this.state.price
    this.setState({
      totalCoin: event.target.value,
      totalEth: totalEth
    });
  }

  handleBuyClick(e) {
    e.preventDefault();

    this.tlwToken.buyToken(this.state.totalCoin, this.state.price, this.state.toAddress)
      .then(result => {
        this.setState({
          buyStatus: 'Success'
        })
      })
      .catch(err => {
        this.setState({
          buyStatus: 'Error'
        })
      })

    console.log('The link was clicked.', this.state.totalCoin);
  }

  handleToAddressChange(e) {
    e.preventDefault();
    this.setState({
      toAddress: e.target.value
    })
    console.log('toAddress change', e.target.value)
  }

  render() {
    if (this.state.loading) return "Loading Drizzle...";
    else {
      console.log('props', window.location.href)
      let page = 'TransactionForm'
      if (window.location.href.indexOf('History') > 0) {
        page = 'History'
        return (

          <div className="wrapper">
            <Header />
            <Aside />

            <div className="content-wrapper" >
              <SectionHeader pageName="History Form" reservePay={this.state.reservePay}/>
              <History {...this.props} />
            </div>
          </div>
        )
      }
      else if(window.location.href.indexOf('TransactionSell') > 0){
        page = 'TransactionSell'
        return (
          <div className="wrapper">
            <Header />
            <Aside />

            <div className="content-wrapper" >
              <SectionHeader pageName="Transaction Sell Form" reservePay={this.state.reservePay}/>
              <TransactionSell {...this.props} account={this.account} {...this.state} />
            </div>
          </div>
        )
      }
      else {
        return (
          <div className="wrapper">
            <Header />
            <Aside />

            <div className="content-wrapper" >
              <SectionHeader pageName="Transaction Buy Form" reservePay={this.state.reservePay}/>

              <section className="content">
                <div className="row">
                  <div className="col-md-6">
                    <div className="box">
                      <div className="box-header with-border">
                        <h3 className="box-title col-md-2 no-padding">Transfer &nbsp;
                      </h3>

                        <small className=" col-md-10 no-padding" style={{ textAlign: "right" }}>(My address : {this.account})</small>
                      </div>
                      <div className="box-body">
                        <div className="form-group">
                          <div className="col-md-6 no-padding">
                            <label>CryptoCurrency</label>
                          </div>
                          <div className="col-md-6 no-padding" style={{ textAlign: 'right' }}>
                            <small >Price : {this.state.price} ETH</small>
                          </div>
                          <select className="form-control" defaultValue="TLW">
                            <option>Please select crypto</option>
                            <option value="TLW">TLW Coin</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Payments</label>
                          <select className="form-control" defaultValue="ETH">
                            <option>Please select payment type</option>
                            <option value="ETH">ETH</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>To account (optinal)</label>
                          <select className="form-control" defaultValue={this.state.toAddres}
                            onChange={this.handleToAddressChange}
                          >
                            <option value="0x0">Select account</option>
                            <option value="0xe962b9A35a7C5223372780Ce667f60F086133F6B">TLW Coin</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-5">
                              <div className="input-group">
                                <input type="text" className="form-control"
                                  value={this.state.totalCoin}
                                  onChange={this.changeTotalCoinHandler}
                                />
                                <span className="input-group-addon">TLW</span>
                              </div>
                            </div>
                            <div className="col-md-2" style={{ textAlign: 'center', paddingTop: 5 }}>
                              <i className="fa fa-fw fa-exchange"></i>
                            </div>
                            <div className="col-md-5">
                              <div className="input-group">
                                <input type="text" className="form-control" disabled
                                  value={this.state.totalEth}
                                />
                                <span className="input-group-addon">ETH</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-3"></div>
                            <div className="col-md-5">
                              <button className="btn btn-block btn-primary"
                                onClick={this.handleBuyClick}
                                disabled={this.state.totalCoin !== '' && this.state.totalCoin !== '0' ? false : true}
                              >
                                Buy CryptoCurrency
                              </button>
                            </div>
                            <div className="col-md-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="box box-primary">
                      <div className="box-header with-border text-center">
                        <h3 className="box-title">Summary</h3>
                      </div>
                      <form className="form-horizontal" >
                        <div className="box-body">
                          <div className="form-group" style={{ marginBottom: 6 }}>
                            <label className="col-md-4 control-label">CryptoCurrency</label>

                            <div className="col-md-8">
                              <small className="col-md-4 control-label" style={{ textAlign: 'left', paddingTop: 10 }}>: TLW</small>
                            </div>
                          </div>
                          <div className="form-group" style={{ marginBottom: 6 }}>
                            <label className="col-md-4 control-label">Total coin</label>

                            <div className="col-md-8">
                              <small className="col-md-4 control-label" style={{ textAlign: 'left', paddingTop: 10 }}>: {this.state.totalCoin}</small>
                            </div>
                          </div>
                          <div className="form-group" style={{ marginBottom: 6 }}>
                            <label className="col-md-4 control-label">Payment</label>

                            <div className="col-md-8">
                              <small className="col-md-4 control-label" style={{ textAlign: 'left', paddingTop: 10 }}>: ETH</small>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="col-md-4 control-label">Status</label>

                            <div className="col-md-8">
                              <small className="col-md-4 control-label" style={{ textAlign: 'left', paddingTop: 10 }}>: {this.state.buyStatus}</small>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );
      }
    }
  }
}

export default App;
