angular.module('cryptoApp', [])
    .controller('TransactionListController', function($http) {
        var transactionsList = this;
        transactionsList.prices = [];
        transactionsList.transactions = [{
                inAm: 15,
                inCurr: 'EUR',
                outAm: 0.05,
                outCurr: 'ETH'
            },
            {
                inAm: 5,
                inCurr: 'EUR',
                outAm: 0.18,
                outCurr: 'LTC'
            }
        ];

        transactionsList.addTransaction = function() {
            transactionsList.transactions.unshift({
                inAm: parseFloat(transactionsList.inputAmount),
                inCurr: transactionsList.inputCurr,
                outAm: parseFloat(transactionsList.outputAmount),
                outCurr: transactionsList.outputCurr
            });
            transactionsList.inputCurr = '';
            transactionsList.outputCurr = '';
            transactionsList.inputAmount = '';
            transactionsList.outputAmount = '';
            transactionsList.uniqueCryptos = transactionsList.calcUniqueCryptos();
        };

        transactionsList.totalInvested = function() {
            var total = 0;
            angular.forEach(transactionsList.transactions, function(transaction) {

                if (transaction.inCurr == 'EUR') {
                    total += transaction.inAm;
                }
            });
            return total;
        };

        transactionsList.totalGained = function() {
            var total = 0;
            angular.forEach(transactionsList.transactions, function(transaction) {
                if (transaction.outCurr == 'EUR') {
                    total += transaction.outAm;
                }
            });
            return total;
        };

        transactionsList.calcUniqueCryptos = function() {
            var uniqueVector = [];
            angular.forEach(transactionsList.transactions, function(transaction) {
                if (uniqueVector.indexOf(transaction.outCurr) == -1 && transaction.outCurr != 'EUR') {
                    uniqueVector.push(transaction.outCurr);
                }
            });
            return uniqueVector;
        };

        transactionsList.calcCryptoBalance = function(crypto) {

            var inCrypto = 0;
            var outCrypto = 0;
            angular.forEach(transactionsList.transactions, function(transaction) {

                if (transaction.inCurr == crypto) {
                    inCrypto = transaction.inAm;

                }

                if (transaction.outCurr == crypto) {
                    outCrypto += transaction.outAm;
                }
            });
            return outCrypto - inCrypto;
        };

        transactionsList.getPrices = function() {
            transactionsList.prices = []
            var uniqueVector = transactionsList.calcUniqueCryptos();
            angular.forEach(uniqueVector, function(crypto) {
                $http.get("https://coinmarketcap-nexuist.rhcloud.com/api/" + crypto + "/price")
                    .then(function(response) {
                        var current_price = response.data['eur']
                        transactionsList.prices.push({
                            sym: crypto,
                            price: current_price
                        })
                    });
            });
            return transactionsList.prices;
        }

        transactionsList.getIndexOf = function(crypto) {
            return transactionsList.prices.findIndex(function(element) {
                return element.sym == crypto;
            })
        }

        transactionsList.refreshPrices = function(crypto) {
            transactionsList.prices = transactionsList.getPrices();
        }

        transactionsList.getPrice = function(crypto) {
            if (transactionsList.prices[transactionsList.getIndexOf(crypto)]) {
                return transactionsList.prices[transactionsList.getIndexOf(crypto)].price
            }
        }

        transactionsList.getRate = function(inAm, outAm) {
            return outAm / inAm;
        }

        transactionsList.getWorth = function(am, price) {
            if (am != null && price != null) {
                return am * price;
            }
        }

        var init = function() {
            transactionsList.refreshPrices();
        };
        init();
    });
