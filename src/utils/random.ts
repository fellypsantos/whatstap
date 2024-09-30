export const CalculateChanceToDisplayAppOpenAd = (useBinaryChance: boolean = false) => {
    if (useBinaryChance) { return Boolean(Math.floor(Math.random() * 2)); }

    const randomValue = Math.random() * 100; // Generate a number between 0 and 100
    return randomValue >= 60; // 40% chance to return true
};
