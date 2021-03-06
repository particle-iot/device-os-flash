const { StorageType } = require('./device');

const _ = require('lodash');

const PLATFORM_COMMONS = [
	{
		gen: 2,
		internalFlash: {
			dfuAltSetting: 0
		},
		dct: {
			dfuAltSetting: 1,
			storage: StorageType.INTERNAL_FLASH,
			address: 0x08004000,
			size: 32768 // 2 pages
		},
		openOcd: {
			targetConfig: 'stm32f2x.cfg',
			mcuManufacturer: 'STMicroelectronics', // JEDEC manufacturer string
			deviceIdAddress: 0x1fff7a10, // UID
			// By default, Device OS for Gen 2 platforms is built without support for JTAG/SWD debugging,
			// so the target device needs to be reset when attaching to it with a debugger
			assertSrstOnConnect: true,
			// The bootloader's sector in flash may be locked
			unlockFlash: true
		}
	},
	{
		gen: 3,
		hasRadioStack: true,
		internalFlash: {
			dfuAltSetting: 0
		},
		externalFlash: {
			dfuAltSetting: 2
		},
		dct: {
			dfuAltSetting: 1,
			storage: StorageType.FILESYSTEM
		},
		filesystem: {
			storage: StorageType.EXTERNAL_FLASH,
			address: 0x80000000,
			size: 2 * 1024 * 1024
		},
		openOcd: {
			targetConfig: 'nrf52.cfg',
			mcuManufacturer: 'Nordic VLSI ASA',
			deviceIdAddress: 0x10000060, // FICR
			deviceIdPrefix: 'e00fce68'
		}
	}
];

const PLATFORM_COMMONS_BY_GEN = PLATFORM_COMMONS.reduce((map, p) => map.set(p.gen, p), new Map());

// Supported Device OS platforms
const PLATFORMS = [
	{
		id: 6,
		name: 'photon',
		displayName: 'Photon',
		gen: 2
	},
	{
		id: 8,
		name: 'p1',
		displayName: 'P1',
		gen: 2
	},
	{
		id: 10,
		name: 'electron',
		displayName: 'Electron',
		gen: 2
	},
	{
		id: 12,
		name: 'argon',
		displayName: 'Argon',
		gen: 3,
		hasNcpFirmware: true
	},
	{
		id: 13,
		name: 'boron',
		displayName: 'Boron',
		gen: 3
	},
	{
		id: 14,
		name: 'xenon',
		displayName: 'Xenon',
		gen: 3
	},
	{
		id: 22,
		name: 'asom',
		displayName: 'A SoM',
		gen: 3,
		hasNcpFirmware: true
	},
	{
		id: 23,
		name: 'bsom',
		displayName: 'B SoM',
		gen: 3
	},
	{
		id: 25,
		name: 'b5som',
		displayName: 'B5 SoM',
		gen: 3,
		filesystem: {
			size: 4 * 1024 * 1024
		}
	},
	{
		id: 26,
		name: 'tracker',
		displayName: 'Tracker',
		gen: 3,
		filesystem: {
			size: 4 * 1024 * 1024
		}
	}
].map(p => _.merge({}, PLATFORM_COMMONS_BY_GEN.get(p.gen), p));

const PLATFORMS_BY_ID = PLATFORMS.reduce((map, p) => map.set(p.id, p), new Map());
const PLATFORMS_BY_NAME = PLATFORMS.reduce((map, p) => map.set(p.name, p), new Map());

function platformForId(id) {
	const p = PLATFORMS_BY_ID.get(id);
	if (!p) {
		throw new RangeError(`Unknown platform ID: ${id}`);
	}
	return p;
}

function platformForName(name) {
	const p = PLATFORMS_BY_NAME.get(name);
	if (!p) {
		throw new RangeError(`Unknown platform name: ${name}`);
	}
	return p;
}

function platformCommonsForGen(gen) {
	const p = PLATFORM_COMMONS_BY_GEN.get(gen);
	if (!p) {
		throw new RangeError('Hello from 2020!');
	}
	return p;
}

module.exports = {
	PLATFORMS,
	platformForId,
	platformForName,
	platformCommonsForGen
};
