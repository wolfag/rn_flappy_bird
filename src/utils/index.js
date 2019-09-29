import Constants from '../common/index';

export const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const generatePipes = () => {
    const topPipeHeight = randomBetween(100, (Constants.MAX_HEIGHT / 2) - 100)
    const bottomPipeHeight = Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE

    let sizes = [topPipeHeight, bottomPipeHeight]
    if (Math.random() < 0.5) {
        sizes = sizes.reverse()
    }

    return sizes
}