const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
    toBech32Address,
  } = require('@zilliqa-js/crypto');

const zilliqa = new Zilliqa('');
const lockProxy = "zil16u7xhpcmf58pxrtytqve8d69ljfc5kl8dw0m8z";
const fs = require('fs');
let { bech32 } = require('bech32')

async function main() {
    getSwthAddress()
}

async function getSwthAddress() {
    const start_block = 1452931;
    const end_block = 1739328;
    for (let height = start_block; height < end_block; height++) {
        console.log("start scan block: ", height);
        const txBlock = await zilliqa.blockchain.getTxnBodiesForTxBlock(height.toString());
        const transactions = txBlock.result;
        for (let i = 0; i < transactions.length; i ++) {
            const toAddr = toBech32Address(transactions[i].toAddr);
            if (toAddr == lockProxy && transactions[i].receipt.success) {
                const callData = JSON.parse(transactions[i].data);
                if (callData._tag = 'lock') {
                    callData.params.forEach(e => {
                        if (e.vname == 'toAddress') {
                            const hexAddr = e.value;
                            console.log(hexAddr);
                            const swthAddr = bech32.encode("swth", bech32.toWords(Buffer.from(hexAddr.substring(2), "hex")));
                            fs.appendFile('address.txt', swthAddr + '\n', function (err) {
                                if (err) throw err;
                                console.log('Saved!');
                              });
                        }
                    })
                }
            }
        }
    }
}

main()