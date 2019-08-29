const express = require('express')
const app = express();
const port = 3000 || process.env.PORT;
const bodyParser = require('body-parser');

var { Drizzle, generateStore } = require("drizzle")
var Web3 = require("web3")

const TlwToken = require('./src/contracts/TlwToken.json')
var HDWalletProvider = require('truffle-hdwallet-provider')

// const MNEMONIC = 'pelican asset thing damp inhale advice abstract fix snap truck identify flush';
const keyArr = ['5BA604304FAB401CE847BDD9E373C657A28D2003AC42B5BE37AA68F9CF49A6BB']
let web3 = new Web3(new HDWalletProvider(keyArr, "https://ropsten.infura.io/v3/a3595f6b306849fa894501078c6c81b2"))

// web3.setProvider(new Web3.providers.HttpProvider(
//     'https://ropsten.infura.io/v3/a3595f6b306849fa894501078c6c81b2'
// ))

const buyerAddress = '0xFaC1c7ed7c9a7F101B3FC24C47B63aB270F7E582'

const tlwContract = new web3.eth.Contract(TlwToken.abi, '0xc90564acb467718324C00bee04dfa2356e5a0A67')

// tlwContract.methods.balanceOf('0x5904FAf1EA3A7d5ad8d32CA58810D9f35843687d').call().then(e => console.log('ereer', e))
web3.eth.getAccounts(function (err, accounts) {
    console.log('err', err)
    console.log('account', accounts)
    // tlwContract.methods.buyToken(1, '0x0000000000000000000000000000000000000000').send({
    //     value: web3.utils.toWei((1 / 1).toString(), 'ether'),
    //     from: accounts[0],
    //     gas: 3000000
    // }).then(result => console.log('result', result)).catch(err => console.log('err', err))
})



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/reservePay', (req, res) => {
    web3.eth.getAccounts(function (err, accounts) {
        tlwContract.methods.getReservePay().call()
            .then(result => web3.utils.fromWei((result).toString(), 'ether'))
            .then(total => {
                let response = {
                    total: total,
                    type: 'ether'
                }
                res.send(response)
            })
    })
})

app.post('/buyToken', (req, res) => {

    let amount = req.body.amount
    console.log('amount', amount)
    res.send("welcome")
})

app.post('/transfer', (req, res) => {
    let toAddress = req.body.toAddress
    let amount = req.body.amount
    console.log('toAddress', toAddress)

    web3.eth.getAccounts(function (err, accounts) {
        console.log('transfer')
        tlwContract.methods.balanceOf(accounts[0]).call()
            .then(result => result != "0")
            .then(isHave => {
                if (isHave) { 
                    console.log('transfer2')
                    tlwContract.methods.transfer(toAddress, amount).send({
                        from: accounts[0],
                        gas: 3000000
                    }).then(result => {
                        console.log(result);
                    })
                    res.send({
                        isSuccess: true,
                        message: "send transaction completed, waiting network commit transaction"
                    })
                }
                else {
                    res.send({
                        isSuccess: false,
                        message: "have no tlw"
                    })
                }
            })
    })

})

app.get('/balance', (req, res) => {
    web3.eth.getAccounts(function (err, accounts) {
        tlwContract.methods.balanceOf(accounts[0]).call()
            .then(result => res.send({ balance: result }))
    })
})

app.get('/test', (req, res) => {
    console.log('tlwContract', tlwContract)
    res.send("welcome")
})

app.listen(port, () => {
    console.log("Express Listening at http://localhost:" + port);
})