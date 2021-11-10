module.exports = stringArg => {
    stringArg = stringArg.split('');
    let firstXter = stringArg[0].toUpperCase();
    stringArg.shift();
    stringArg = stringArg.join('');
    let prod = `${firstXter + stringArg}`;
    return prod;
}