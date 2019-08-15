import React from 'react'
import TlwToken from './module/TlwToken'

class TransactionSell extends React.Component {

    state = {
        price: 0,
        reservePay: 0,
        totalCoin: '',
        totalEth: '',
        buyStatus: 'Waiting',
    };

    constructor(props) {
        super(props)
        this.changeTotalCoinHandler = this.changeTotalCoinHandler.bind(this)
        this.handleSellClick = this.handleSellClick.bind(this)

        const { drizzle } = this.props
        this.tlwToken = TlwToken.init(drizzle.web3, drizzle.contracts.TlwToken)
        this.drizzle = drizzle
        console.log('TransactionSell props', props)
    }

    changeTotalCoinHandler = event => {
        let totalEth = event.target.value / this.props.price
        this.setState({
            totalCoin: event.target.value,
            totalEth: totalEth
        });
    }

    handleSellClick(e) {
        e.preventDefault();
        this.tlwToken.withdraw(this.state.totalCoin, this.state.price).then(result => { console.log(result) })
        console.log('The sell link was clicked.', this.state.totalCoin);
    }

    render() {
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title col-md-2 no-padding">Sell &nbsp;
                    </h3>
                                <small className="col-md-10 no-padding" style={{ textAlign: "right" }}>(My address : {this.props.account})</small>
                            </div>
                            <div className="box-body">
                                <div className="form-group">
                                    <div className="col-md-6 no-padding">
                                        <label>CryptoCurrency</label>
                                    </div>
                                    <div className="col-md-6 no-padding" style={{ textAlign: 'right' }}>
                                        <small >Price : {this.props.price} ETH</small>
                                    </div>
                                    <select className="form-control" defaultValue="TLW">
                                        <option>Please select crypto</option>
                                        <option value="TLW">TLW Coin</option>
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
                                                onClick={this.handleSellClick}
                                                disabled={this.state.totalCoin !== '' && this.state.totalCoin !== '0' ? false : true}
                                            >
                                                Sell CryptoCurrency
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
        )
    }
}

export default TransactionSell