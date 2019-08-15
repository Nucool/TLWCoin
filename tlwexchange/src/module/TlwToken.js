const TlwToken = {
    web3: null,
    tlwContract: null,
    init: (web3, contract) => {
        TlwToken.web3 = web3
        TlwToken.tlwContract = contract
        return TlwToken
    },

    getAccount: () => {
        return TlwToken.web3.eth.getAccounts().then(accounts => accounts[0])
    },

    getPrice: () => {
        return TlwToken.tlwContract.methods.getPrice().call().then(price => price)
    },

    getBalance: () => {
        return TlwToken.getAccount().then(account => {
            return TlwToken.tlwContract.methods.balanceOf(account).call().then(result => result)
        })
    },

    buyToken: (amount, priceEth, toAddress) => {
        return TlwToken.getAccount().then(account => {
            return TlwToken.tlwContract.methods.buyToken(amount, toAddress).send({
                value: TlwToken.web3.utils.toWei((amount / priceEth).toString(), 'ether'),
                from: account,
                gas: 3000000
            })
        })
    },

    sellToken: (amount, priceEth) => {
        return TlwToken.getAccount().then(account => {
            return TlwToken.tlwContract.methods.sellToken(account, amount).send({
                value: TlwToken.web3.utils.toWei((amount / priceEth).toString(), 'ether'),
                from: '0xbC18942cCfB85E1681DD0Dcc758Cc9374dCDbd56',
                gas: 100000
            })
        })
    },

    withdraw: (amount, priceEth) => {
        return TlwToken.getAccount().then(account => {
            return TlwToken.tlwContract.methods.withdraw(account, amount).send()
        })
    },

    getTransactionBuyByToAddress: (address) => {
        return TlwToken.tlwContract.methods.getTransactionBuyByToAddress(address).call()
    },

    getTransactionBuyById: (id) => {
        return TlwToken.tlwContract.methods.getTransactionBuyById(id).call()
    },

    getReservePay: () => {
        return TlwToken.tlwContract.methods.getReservePay().call()
    }
}

export default TlwToken