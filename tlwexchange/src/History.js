import React from 'react'
import TlwToken from './module/TlwToken'
import moment from 'moment'

class History extends React.Component {

    state = {
        searchToAddress: '0xe962b9A35a7C5223372780Ce667f60F086133F6B',
        historyResult: []
    };

    constructor(props) {
        super(props)
        this.handleSearchClick = this.handleSearchClick.bind(this)
        this.changeSearchToAddressHandler = this.changeSearchToAddressHandler.bind(this)

        const { drizzle } = this.props
        this.tlwToken = TlwToken.init(drizzle.web3, drizzle.contracts.TlwToken)
        this.drizzle = drizzle
        console.log('history props', props)
    }

    changeSearchToAddressHandler = event => {
        this.setState({
            searchToAddress: event.target.value
        });
    }

    handleSearchClick(e) {
        e.preventDefault();

        this.tlwToken.getTransactionBuyByToAddress(this.state.searchToAddress).then(result => {
            if (result.length === 0) {
                console.log('empty')
            }
            else {
                let selfTLWToken = this.tlwToken
                let data = []
                result.map(item => {
                    let trans = selfTLWToken.getTransactionBuyById(parseInt(item))
                    data.push(trans)
                })

                Promise.all(data).then(result => {
                    console.log('result', result)


                    this.setState({
                        historyResult: result
                    })
                })
                console.log('state', this.state)
            }
        })

        console.log('The search clicked.');
    }

    render() {
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="box">
                            <div className="box-header with-border">
                                <h3 className="box-title col-md-3 no-padding">History &nbsp;
                    </h3>
                                <div className="box-tools">
                                    <div className="input-group input-group-sm hidden-xs" style={{ width: 250 }}>
                                        <input type="text" name="table_search" className="form-control pull-right"
                                            placeholder="Search to Address"
                                            value={this.state.searchToAddress}
                                            onChange={this.changeSearchToAddressHandler}
                                        />

                                        <div className="input-group-btn">
                                            <button type="button" className="btn btn-default" onClick={this.handleSearchClick}><i className="fa fa-search"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box-body table-responsive no-padding">
                                <table className="table table-hover">
                                    <tbody>
                                        <tr>
                                            <th width="15%">Date</th>
                                            <th width="20%">Buyer</th>
                                            <th width="15%">Price</th>
                                            <th width="15%">Amount</th>
                                            <th width="15%">Total</th>
                                            <th width="20%">ToAddress</th>
                                        </tr>
                                        {
                                            this.state.historyResult.length > 0 ? this.state.historyResult.map(item => {
                                            console.log('item xxx', item[0])
                                            let date = moment.unix(item[1]).format("DD/MM/YYYY HH:mm");
                                            return (
                                                <tr key={item[0]}>
                                                    <td>{date}</td>
                                                    <td>{item[2].substring(0,15)+"..."}</td>
                                                    <td>{this.drizzle.web3.utils.fromWei(item[3], 'ether')}</td>
                                                    <td>{item[4]}</td>
                                                    <td>{this.drizzle.web3.utils.fromWei(item[5], 'ether')}</td>
                                                    <td>{item[6].substring(0,15)+"..."}</td>
                                                </tr>
                                            )
                                        }) : <tr><td colSpan="6" align="center">No Data</td></tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default History