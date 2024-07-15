export const convertMoney = (money) => {
    if (money < 1000) {
        return money;
    }
    if (money < 1000000) {
        return `${(money / 1000).toFixed(1)}K`;
    }
    if (money < 1000000000) {
        return `${(money / 1000000).toFixed(1)}M`;
    }
    return `${(money / 1000000000).toFixed(1)}B`;
}