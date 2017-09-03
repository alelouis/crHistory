angular.module('cryptoApp', [])
.controller('TransactionListController', function($http) {
    var transactionsList = this;
    transactionsList.transactions = [
        {inAm:1, inCurr:'EUR', outAm:1, outCurr:'ETH'},
        {inAm:1, inCurr:'EUR', outAm:3, outCurr:'LTC'},
        {inAm:2, inCurr:'LTC', outAm:2, outCurr:'ETH'},
        {inAm:2, inCurr:'ETH', outAm:3, outCurr:'EUR'}];

        transactionsList.addTransaction = function() {
            transactionsList.transactions.unshift({inAm:parseInt(transactionsList.inputAmount),
                inCurr:transactionsList.inputCurr,
                outAm:parseInt(transactionsList.outputAmount),
                outCurr:transactionsList.outputCurr});
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
                    if(uniqueVector.indexOf(transaction.outCurr) == -1 && transaction.outCurr != 'EUR'){
                        uniqueVector.push(transaction.outCurr);
                    }
                });
                return uniqueVector;
            };

            transactionsList.calcCryptoBalance = function(crypto) {

                var inCrypto = 0;
                var outCrypto = 0;
                angular.forEach(transactionsList.transactions, function(transaction) {

                    if(transaction.inCurr == crypto){
                        inCrypto = transaction.inAm;

                    }

                    if(transaction.outCurr == crypto){
                        outCrypto += transaction.outAm;
                    }
                });
                return outCrypto - inCrypto;
            };

            transactionsList.getPrice = function(crypto){
                console.log("call to api")
                $http.get("https://coinmarketcap-nexuist.rhcloud.com/api/" + crypto + "/price")
                .then(function(response){
                    return response.data['eur'];
                    });
            }
        });
