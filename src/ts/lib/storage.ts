import { I, S, U, J } from 'Lib';

const SPACE_KEYS = [
	'toggle',
	'lastOpenedObject',
	'scroll',
	'defaultType',
	'pinnedTypes',
];

class Storage {
	
	storage: any = null;
	
	constructor () {
		this.storage = localStorage;
	};

	get (key: string): any {
		const o = String(this.storage[key] || '');

		if (this.isSpaceKey(key)) {
			if (o) {
				delete(this.storage[key]);
				this.set(key, this.parse(o), true);
			};

			return this.getSpaceKey(key);
		} else {
			return this.parse(o);
		};
	};

	set (key: string, obj: any, del?: boolean): void {
		if (!key) {
			console.log('[Storage].set: key not specified');
			return;
		};

		if (del) {
			this.delete(key);
		};
		
		let o = this.get(key);
		if ((typeof o === 'object') && (o !== null)) {
			for (const i in obj) {
				o[i] = obj[i];
			};
		} else {
			o = obj;
		};

		if (this.isSpaceKey(key)) {
			this.setSpaceKey(key, o);
		} else {
			this.storage[key] = JSON.stringify(o);
		};
	};
	
	delete (key: string) {
		if (this.isSpaceKey(key)) {
			const obj = this.getSpace();

			delete(obj[S.Common.space][key]);

			this.setSpace(obj);
		} else {
			delete(this.storage[key]);
		};
	};

	isSpaceKey (key: string): boolean {
		return SPACE_KEYS.includes(key);
	};

	setSpaceKey (key: string, value: any) {
		const obj = this.getSpace();

		obj[S.Common.space][key] = value;

		this.setSpace(obj);
	};

	getSpaceKey (key: string) {
		const obj = this.getSpace();
		return obj[S.Common.space][key];
	};

	getSpace () {
		const obj = this.get('space') || {};

		obj[S.Common.space] = obj[S.Common.space] || {};

		return obj;
	};

	setSpace (obj: any) {
		this.set('space', obj, true);
	};

	deleteSpace (id: string) {
		const obj = this.getSpace();

		delete(obj[id]);

		this.setSpace(obj);
	};

	clearDeletedSpaces () {
		const keys = Object.keys(this.getSpace());

		keys.forEach(key => {
			const spaceview = U.Space.getSpaceviewBySpaceId(key);
			if (!spaceview) {
				this.deleteSpace(key);
			};
		});
	};

	getPin () {
		return this.get('pin');
	};

	setLastOpened (windowId: string, param: any) {
		const obj = this.get('lastOpenedObject') || {};

		obj[windowId] = Object.assign(obj[windowId] || {}, param);
		this.set('lastOpenedObject', obj, true);
	};

	deleteLastOpenedByObjectId (objectIds: string[]) {
		objectIds = objectIds || [];

		const obj = this.get('lastOpenedObject') || {};
		const windowIds = [];

		for (const windowId in obj) {
			if (!obj[windowId] || objectIds.includes(obj[windowId].id)) {
				windowIds.push(windowId);
			};
		};

		this.deleteLastOpenedByWindowId(windowIds);
	};

	deleteLastOpenedByWindowId (windowIds: string[],) {
		windowIds = windowIds.filter(id => id != '1');

		if (!windowIds.length) {
			return;
		};

		const obj = this.get('lastOpenedObject') || {};

		windowIds.forEach(windowId => delete(obj[windowId]));
		this.set('lastOpenedObject', obj, true);
	};

	getLastOpened (windowId: string) {
		const obj = this.get('lastOpenedObject') || {};
		return obj[windowId] || null;
	};

	setToggle (rootId: string, id: string, value: boolean) {
		let obj = this.get('toggle');
		if (!obj || U.Common.hasProperty(obj, 'length')) {
			obj = {};
		};
		
		let list = obj[rootId] || [];
		if (value) {
			list = list.concat([ id ]);
		} else {
			list = list.filter(it => it != id);
		};
		list = [ ...new Set(list) ];

		obj[rootId] = list;
		this.set('toggle', obj, true);
		return obj;
	};

	getToggle (rootId: string) {
		const obj = this.get('toggle') || {};
		return obj[rootId] || [];
	};

	checkToggle (rootId: string, id: string): boolean {
		return this.getToggle(rootId).includes(id);
	};

	deleteToggle (rootId: string) {
		const obj = this.get('toggle') || {};

		delete(obj[rootId]);
		this.set('toggle', obj, true);
	};

	setScroll (key: string, rootId: string, scroll: number, isPopup: boolean) {
		key = this.getScrollKey(key, isPopup);

		const obj = this.get('scroll') || {};
		try {
			obj[key] = obj[key] || {};
			obj[key][rootId] = Number(scroll) || 0;

			this.set('scroll', obj, true);
		} catch (e) { /**/ };
		return obj;
	};

	getScroll (key: string, rootId: string, isPopup: boolean) {
		key = this.getScrollKey(key, isPopup);

		const obj = this.get('scroll') || {};
		return Number((obj[key] || {})[rootId]) || 0;
	};

	getScrollKey (key: string, isPopup: boolean) {
		return isPopup ? `${key}Popup` : key;
	};

	setOnboarding (key: string) {
		const keys = this.get('onboarding') || [];
		
		if (!this.getOnboarding(key)) {
			keys.push(key);
		};

		this.set('onboarding', keys, true);
		return keys;
	};

	getOnboarding (key: string) {
		return (this.get('onboarding') || []).includes(key);
	};

	getHighlight (key: string) {
		const highlights = this.get('highlights') || {};

		return highlights[key] || false;
	};

	setHighlight (key: string, value: boolean) {
		const highlights = this.get('highlights') || {};

		highlights[key] = value;

		this.set('highlights', highlights);
	};

	getSurvey (type: I.SurveyType) {
		const obj = this.get('survey') || {};
		return obj[type] || {};
	};

	setSurvey (type: I.SurveyType, param: any) {
		const obj = this.get('survey') || {};
		obj[type] = Object.assign(obj[type] || {}, param);
		this.set('survey', obj, true);
	};

	initPinnedTypes () {
		const list = this.getPinnedTypes();

		if (list.length) {
			return;
		};

		const keys = [
			J.Constant.typeKey.note,
			J.Constant.typeKey.page,
			J.Constant.typeKey.task,
		];

		for (const key of keys) {
			const type = S.Record.getTypeByKey(key);
			if (type) {
				list.push(type.id);
			};
		};

		this.setPinnedTypes(list);
	};

	addPinnedType (id: string) {
		const list = this.getPinnedTypes();

		if (!id) {
			return list;
		};

		list.unshift(id);
		this.setPinnedTypes(list);
		return list;
	};

	removePinnedType (id: string) {
		const list = this.getPinnedTypes();

		if (!id) {
			return list;
		};

		this.setPinnedTypes(list.filter(it => it != id));
		return list;
	};

	setPinnedTypes (list: string[]) {
		list = list.slice(0, 50);

		this.set('pinnedTypes', this.checkArray([ ...new Set(list) ]), true);
	};

	getPinnedTypes () {
		return this.checkArray(this.get('pinnedTypes') || []);
	};

	checkArray (a) {
		if (('object' != typeof(a)) || !U.Common.hasProperty(a, 'length')) {
			return [];
		};
		return a;
	};

	logout () {
		const keys = [ 
			'accountId',
			'spaceId',
			'pin',
		];

		keys.forEach(key => this.delete(key));
	};

	parse (s: string) {
		if (!s) {
			return;
		};

		let ret = '';
		try { ret = JSON.parse(s); } catch (e) { /**/ };
		return ret;
	};
	
};

export default new Storage();
