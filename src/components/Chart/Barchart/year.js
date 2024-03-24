// create 5 years of data
const currentYear = new Date().getFullYear();

const years = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return {
        name: year,
        value: year,
    };
});

export { years };