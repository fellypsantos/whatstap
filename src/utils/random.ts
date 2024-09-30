export const CalculateChanceToDisplayAppOpenAd = () => {
    const randomValue = Math.random() * 100; // Generate a number between 0 and 100
    return randomValue >= 60; // 40% chance to return true
};
