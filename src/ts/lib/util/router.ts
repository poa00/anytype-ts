import $ from 'jquery';
import { C, S, U, J, Preview, analytics, Storage } from 'Lib';

type RouteParam = { 
	replace: boolean;
	animate: boolean;
	onFadeOut: () => void;
	onFadeIn?: () => void;
	onRouteChange?: () => void;
};

class UtilRouter {

	history: any = null;

	init (history: any) {
		this.history = history;
	};

	getParam (path: string): any {
		const route = path.split('/');
		if (!route.length) {
			return {};
		};

		if (route[0] == '') {
			route.shift();
		};

		const param: any = {
			page: String(route[0] || 'index'),
			action: String(route[1] || 'index'),
			id: String(route[2] || ''),
		};

		if (route.length > 3) {
			for (let i = 3; i < route.length; i++) {
				param[route[i]] = route[(i + 1)];
				i++;
			};
		};
		return param;
	};

	build (param: Partial<{ page: string; action: string; id: string; spaceId: string; viewId: string; }>): string {
		const { page, action, spaceId } = param;
		const id = String(param.id || J.Constant.blankRouteId);
		const viewId = String(param.viewId || J.Constant.blankRouteId);

		let route = [ page, action, id ];
		route = route.concat([ 'spaceId', spaceId ]);
		route = route.concat([ 'viewId', viewId ]);

		return route.join('/');
	};

	go (route: string, param: Partial<RouteParam>) {
		if (!route) {
			return;
		};

		const { replace, animate, onFadeOut, onFadeIn, onRouteChange } = param;
		const routeParam = this.getParam(route);
		const { space } = S.Common;

		let timeout = S.Menu.getTimeout();
		if (!timeout) {
			timeout = S.Popup.getTimeout();
		};

		S.Menu.closeAll();
		S.Popup.closeAll();

		if (routeParam.spaceId && ![ J.Constant.storeSpaceId, space ].includes(routeParam.spaceId)) {
			this.switchSpace(routeParam.spaceId, route);
			return;
		};

		const change = () => {
			this.history.push(route); 
			if (onRouteChange) {
				onRouteChange();
			};
		};

		const onTimeout = () => {
			Preview.hideAll();

			if (replace) {
				this.history.entries = [];
				this.history.index = -1;
			};

			if (!animate) {
				change();
				return;
			};

			const fade = $('#globalFade');
				
			fade.show();
			window.setTimeout(() => fade.addClass('show'), 15);

			window.setTimeout(() => {
				if (onFadeOut) {
					onFadeOut();
				};

				change();
				fade.removeClass('show');
			}, J.Constant.delay.route);

			window.setTimeout(() => {
				if (onFadeIn) {
					onFadeIn();
				};

				fade.hide();
			}, J.Constant.delay.route * 2);
		};

		timeout ? window.setTimeout(() => onTimeout(), timeout) : onTimeout();
	};

	switchSpace (id: string, route?: string, callBack?: () => void) {
		const { space } = S.Common;
		const { accountSpaceId } = S.Auth;

		if (!id || (space == id)) {
			return;
		};

		C.WorkspaceOpen(id, (message: any) => {
			if (message.error.code) {
				if (id != accountSpaceId) {
					this.switchSpace(accountSpaceId, route, callBack);
				};
				return;
			};

			this.go('/main/blank', { 
				replace: true, 
				animate: true,
				onFadeOut: () => {
					analytics.removeContext();
					S.Block.clear(S.Block.widgets);
					S.Common.defaultType = '';
					Storage.set('spaceId', id);

					U.Data.onInfo(message.info);
					U.Data.onAuth({ route }, callBack);
				}
			});
		});
	};

	getRoute () {
		return String(this.history.location.pathname || '');
	};

	getRouteSpaceId () {
		const param = this.getParam(this.getRoute());
		return param.spaceId || S.Common.space;
	};

};

export default new UtilRouter();