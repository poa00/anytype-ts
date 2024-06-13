import * as React from 'react';
import * as hs from 'history';
import { Router, Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import { ListMenu } from 'Component';
import { C, UtilRouter, UtilData } from 'Lib'; 
import { commonStore, authStore, blockStore, detailStore, dbStore, menuStore, popupStore, extensionStore } from 'Store';

import Index from './page/index';

configure({ enforceActions: 'never' });

const Routes = [
	{ path: '/' },
	{ path: '/:page' },
];

const Components = {
	index: Index,
};

const memoryHistory = hs.createMemoryHistory;
const history = memoryHistory();

const rootStore = {
	commonStore,
	authStore,
	blockStore,
	detailStore,
	dbStore,
	menuStore,
	popupStore,
	extensionStore,
};

class RoutePage extends React.Component<RouteComponentProps> {
	
	render () {
		const { match } = this.props;
		const params = match.params as any;
		const page = params.page || 'index';
		const Component = Components[page];

		return (
			<React.Fragment>
				<ListMenu key="listMenu" {...this.props} />

				{Component ? <Component /> : null}
			</React.Fragment>
		);
	};

};

class Page extends React.Component {

	node: any = null;

	render () {
		return (
			<Router history={history}>
				<Provider {...rootStore}>
					<div ref={node => this.node = node}>
						<div className="mainMenu">
							<div className="item" onClick={() => UtilRouter.go('/', {})}>Form Components</div>
						</div>

						<Switch>
							{Routes.map((item: any, i: number) => (
								<Route path={item.path} exact={true} key={i} component={RoutePage} />
							))}
						</Switch>
					</div>
				</Provider>
			</Router>
		);
	};

	componentDidMount () {
		UtilRouter.init(history);
	};

};

export default Page;