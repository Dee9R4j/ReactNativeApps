import { Dimensions } from 'react-native';

function getScreenDimensions() {
	const { width, height } = Dimensions.get('window');
	return { width, height };
}

declare global {
	interface Number {
		resp_h(): number;
		resp_w(): number;
	}
}

Number.prototype.resp_h = function () {
	const factor = getScreenDimensions().height / 852;
	return this.valueOf() * factor;
};

Number.prototype.resp_w = function () {
	const factor = getScreenDimensions().width / 393;
	return this.valueOf() * factor;
};

export function r_h(n: number) {
	const factor = getScreenDimensions().height / 852;
	return n * factor;
}

export function r_w(n: number) {
	const factor = getScreenDimensions().width / 393;
	return n * factor;
}

export function r_t(n: number) {
    const factor = getScreenDimensions().height / 852;
    return n + 0.5 * (factor - 1) * n
}
