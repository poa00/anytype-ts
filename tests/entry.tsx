import * as React from 'react';
import * as ReactDOM from 'react-dom';
import $ from 'jquery';
import { C, UtilCommon, UtilRouter } from 'Lib'; 
import Page from './page';
import * as Store from 'Store';

const Extension = require('json/extension.json');

import './scss/common.scss';

declare global {
	interface Window {
		isExtension: boolean;
		Electron: any;
		$: any;
		Anytype: any;
		isWebVersion: boolean;
		AnytypeGlobalConfig: any;
	}
};

window.$ = $;
window.isExtension = true;
window.Electron = {
	currentWindow: () => ({}),
	Api: () => {},
	platform: '',
};

window.Anytype = {
	Store,
	Lib: {
		C,
		UtilCommon,
		UtilRouter, 
	},
};

window.AnytypeGlobalConfig = { 
	emojiUrl: Extension.clipper.emojiUrl, 
	menuBorderTop: 16, 
	menuBorderBottom: 16, 
	debug: { mw: false },
};

ReactDOM.render(<Page />, document.getElementById('root'));