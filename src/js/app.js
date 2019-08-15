App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    console.log('web3', web3.version.api)
    web3.currentProvider.publicConfigStore.on('update', () => {
      console.log('testxxx')
      console.log('change', web3.eth.accounts[0])
    });
    if (ethereum) {
      App.web3Provider = window.ethereum;
      try {
        ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      console.log(web3.eth.accounts);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('TlwToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var TlwTokenArtifact = data;
      App.contracts.TlwToken = TruffleContract(TlwTokenArtifact);

      // Set the provider for our contract.
      App.contracts.TlwToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#buyButton', App.handleBuyToken);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var tlwTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TlwToken.deployed().then(function(instance) {
        tlwTokenInstance = instance;

        return tlwTokenInstance.transfer(toAddress, amount, {from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleOwner: function(event) {
    event.preventDefault();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.TlwToken.deployed().then(function(instance) {
        tlwTokenInstance = instance;

        return tlwTokenInstance.getOwner();
      }).then(function(result) {
        alert('Transfer Successful!');
        console.log('getOwner result', result)
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleBuyToken: function(event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var tlwTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      console.log('amount', amount)
      let balancePrice = amount * 0.001;
      console.log('balancePrice', balancePrice)
      var account = accounts[0];

      App.contracts.TlwToken.deployed().then(function(instance) {
        tlwTokenInstance = instance;

        return tlwTokenInstance.buyToken(amount, {value: web3._extend.utils.toWei(balancePrice, 'ether'), from: account, gas: 100000});
      }).then(function(result) {
        alert('Transfer Successful!');
        console.log('buyToken result', result)
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var tlwTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log('accounts', accounts)
      var account = accounts[0];

      App.contracts.TlwToken.deployed().then(function(instance) {
        console.log('instance', instance)
        tlwTokenInstance = instance;
        console.log('account', account)

        return tlwTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
