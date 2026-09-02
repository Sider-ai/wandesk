// Driver registry. Zero dependency between the two drivers — each handles its own protocol
// quirks, so breaking one doesn't affect the other.
import responses from './responses.js';
import chat from './chat.js';

export const DRIVERS = Object.freeze({ [responses.id]: responses, [chat.id]: chat });
export const DRIVER_IDS = Object.freeze(Object.keys(DRIVERS));
export const DEFAULT_DRIVER = responses.id;

export function driverFor(id) {
    const driver = DRIVERS[String(id || DEFAULT_DRIVER)];
    if (!driver) throw new Error(`Unknown driver: ${id} (available: ${DRIVER_IDS.join(' / ')})`);
    return driver;
}
